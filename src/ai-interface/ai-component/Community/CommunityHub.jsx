// --------- CommunityHub.jsx ---------
import React, { useEffect, useState, useMemo } from 'react';
import { db, storage } from '../../../config/firebase';
import { collection, query, limit, getDocs, onSnapshot, orderBy, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../../context/AuthContext';
import debounce from 'just-debounce-it';
import { formatDistanceToNow } from 'date-fns';
import {
  Search as IconSearch,
  PlusCircle as IconPlus,
  MessageSquare as IconChat,
  Gamepad as IconGame,
  Smartphone as IconCoach,
  Heart as IconHeart,
  MessageCircle as IconMessage,
  X as IconX,
  Upload as IconUpload,
  Trash2 as IconTrash,
  Flag as IconFlag
} from 'lucide-react';
import './CommunityHub.css';

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState('posts'); 
  const [theme, setTheme] = useState('dark'); 

  useEffect(() => {
    const el = document.querySelector('.ch-community-root');
    if (el) el.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="ch-community-root" data-theme={theme}>
      <div className="ch-wrap">
        <header className="ch-header">
          <div className="ch-header-left">
            <h1>Community Hub</h1>
            <p className="ch-subtitle">A calm, modern space — posts, chat, games & AI coach</p>
          </div>

          <div className="ch-center-tabs" role="tablist" aria-label="Community sections">
            <Tab label="Posts" active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={<IconPlus />} />
            <Tab label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<IconChat />} />
            <Tab label="Games" active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<IconGame />} />
            <Tab label="AI Coach" active={activeTab === 'coach'} onClick={() => setActiveTab('coach')} icon={<IconCoach />} />
          </div>

          <div className="ch-actions">
            <div className="ch-search ch-small" aria-hidden>
              <IconSearch size={16} />
              <input placeholder="Search posts, tags..." aria-label="Search posts" />
            </div>

            <button
              className="ch-btn-ghost"
              onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
              title="Toggle theme"
              style={{ marginLeft: 8 }}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>

        <div className="ch-container">
          <aside className="ch-aside-left">
            <LeftSidebar />
          </aside>

          <main className="ch-center">
            {activeTab === 'posts' && <PostsSection />}
            {activeTab === 'chat' && <div style={{ padding: 16 }}><em>Chat tab (coming)</em></div>}
            {activeTab === 'games' && <div style={{ padding: 16 }}><em>Games tab (coming)</em></div>}
            {activeTab === 'coach' && <div style={{ padding: 16 }}><em>AI Coach tab (coming)</em></div>}
          </main>

          <aside className="ch-aside-right">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick, icon }) {
  return (
    <button className={`ch-tab-btn ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active} title={label}>
      <span className="ch-tab-icon">{icon}</span>
      <span className="ch-tab-label">{label}</span>
    </button>
  );
}

function LeftSidebar() {
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'posts'), limit(2000)));
        const counts = {};
        snapshot.forEach(docSnap => {
          const p = docSnap.data();
          (p.tags || []).forEach(t => t && (counts[t] = (counts[t] || 0) + 1));
        });
        setTopics(Object.entries(counts).map(([tag, c]) => ({ tag, c })).slice(0, 28));
      } catch (err) { console.warn(err); }
    })();
  }, []);

  return (
    <>
      <div className="ch-card">
        <h3>Explore Topics</h3>
        <div className="ch-topic-wrap" style={{ marginTop: 12 }}>
          <button className="ch-topic-pill ch-active">All</button>
          {topics.map(t => (
            <button key={t.tag} className="ch-topic-pill">
              {t.tag} <span className="ch-small ch-muted" style={{ marginLeft: 8 }}>{t.c}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <h3 style={{ marginTop: 6 }}>Quick links</h3>
          <ul style={{ paddingLeft: 18, color: '#cfefff' }}>
            <li>Community Guidelines</li>
            <li>Events</li>
            <li>Resources</li>
            <li>Support</li>
          </ul>
        </div>
      </div>

      <div className="ch-card" style={{ marginTop: 14 }}>
        <h3>Active members</h3>
        <div className="ch-members" style={{ marginTop: 10 }}>
          <MemberList />
        </div>
      </div>

      <div className="ch-card" style={{ marginTop: 14 }}>
        <h3>Upcoming events</h3>
        <EventsPreview />
      </div>
    </>
  );
}

function RightSidebar() {
  return (
    <>
      <div className="ch-card ch-pinned">
        <h3>Pinned</h3>
        <ul style={{ marginTop: 10 }}>
          <li>Community Guidelines</li>
          <li>Trusted Resources</li>
          <li>Emergency Helplines</li>
        </ul>
      </div>

      <div className="ch-card" style={{ marginTop: 12 }}>
        <h3>Activity</h3>
        <div className="ch-small-note ch-muted">Top topics this week</div>
        <ul style={{ marginTop: 10 }}>
          <li>• Mindfulness</li>
          <li>• Sleep support</li>
          <li>• Coping strategies</li>
        </ul>
      </div>
    </>
  );
}

function PostsSection() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryInput, setQueryInput] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [sort, setSort] = useState('newest');
  const [composerOpen, setComposerOpen] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState({});

  useEffect(() => {
    fetchTags();
    let q = collection(db, 'posts');
    if (sort === 'newest') q = query(q, orderBy('created_at', 'desc'));
    else if (sort === 'top') q = query(q, orderBy('likeCount', 'desc'), orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      if (queryInput) {
        data = data.filter(p => (p.title || '').toLowerCase().includes(queryInput.toLowerCase()) || (p.body || '').toLowerCase().includes(queryInput.toLowerCase()));
      }
      if (selectedTag) {
        data = data.filter(p => (p.tags || []).includes(selectedTag));
      }

      setPosts(data);
      setLoading(false);
    }, (error) => {
      console.warn("Error listening to posts", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [queryInput, selectedTag, sort]);

  const debouncedQuery = useMemo(() => debounce((q) => {
    setQueryInput(q);
  }, 300), []);

  async function fetchTags() {
    try {
      const snapshot = await getDocs(query(collection(db, 'posts'), limit(2000)));
      const counts = {};
      snapshot.forEach(docSnap => {
        const p = docSnap.data();
        (p.tags || []).forEach(t => t && (counts[t] = (counts[t] || 0) + 1));
      });
      setTags(Object.entries(counts).map(([tag, c]) => ({ tag, c })).slice(0, 40));
    } catch (err) { console.warn(err); }
  }

  async function handleCreate(post) {
    try {
      let attachments = null;
      if (post.file) {
        const fileName = `${Date.now()}-${post.file.name}`;
        const fileRef = ref(storage, `post-attachments/${fileName}`);
        await uploadBytes(fileRef, post.file);
        const url = await getDownloadURL(fileRef);
        attachments = [{ url, name: post.file.name }];
      }

      const payload = {
        author_id: user?.uid || null,
        author: {
          full_name: user?.displayName || 'Anonymous',
          avatar_url: user?.photoURL || '/default-avatar.png'
        },
        title: post.title,
        body: post.body,
        tags: post.tags || [],
        anonymous: post.anonymous || false,
        attachments,
        visibility: 'public',
        created_at: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
      };
      
      await addDoc(collection(db, 'posts'), payload);
      fetchTags();
      return { success: true };
    } catch (err) {
      console.error('create error', err);
      return { success: false, error: err };
    }
  }

  async function toggleLike(postId) {
    if (!user) { alert('Please login to react'); return; }
    try {
      setLikeAnimating(prev => ({ ...prev, [postId]: true }));
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentLikes = postSnap.data().likeCount || 0;
        await updateDoc(postRef, { likeCount: currentLikes + 1 });
      }
      setTimeout(() => { setLikeAnimating(prev => ({ ...prev, [postId]: false })); }, 300);
    } catch (err) { console.warn(err); setLikeAnimating(prev => ({ ...prev, [postId]: false })); }
  }

  async function addComment(postId, body) {
    if (!user) { alert('Please login to comment'); return; }
    try {
      await addDoc(collection(db, 'comments'), { post_id: postId, author_id: user.uid, body, created_at: new Date().toISOString() });
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentComments = postSnap.data().commentCount || 0;
        await updateDoc(postRef, { commentCount: currentComments + 1 });
      }
    } catch (err) { console.warn(err); }
  }

  async function reportPost(postId) {
    try {
      await addDoc(collection(db, 'reports'), { reporter_id: user?.uid || null, target_type: 'post', target_id: postId, reason: 'Inappropriate', status: 'open', created_at: new Date().toISOString() });
      alert('Reported — moderators will review');
    } catch (err) { console.warn(err); }
  }

  async function deletePost(postId) {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) { console.warn(err); }
  }

  return (
    <div>
      <div className="ch-controls-row">
        <div className="ch-search">
          <IconSearch size={16} />
          <input placeholder="Search posts, topics..." onChange={(e) => debouncedQuery(e.target.value)} aria-label="Search posts" />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <select className="ch-select-sort" value={sort} onChange={(e) => { setSort(e.target.value); }}>
            <option value="newest">Newest</option>
            <option value="top">Top</option>
          </select>
          <button className="ch-btn-primary" onClick={() => setComposerOpen(true)}><IconPlus /> New post</button>
        </div>
      </div>

      <div className="ch-feed">
        {loading ? (
          <>
            <div className="ch-skeleton ch-card" />
            <div className="ch-skeleton ch-card" />
          </>
        ) : posts.length === 0 ? (
          <div className="ch-card ch-empty" style={{ textAlign: 'center' }}>
            <h3>No posts yet</h3>
            <p className="ch-muted">Be the first to start a conversation.</p>
            <div style={{ marginTop: 12 }}>
              <button className="ch-btn-primary" onClick={() => setComposerOpen(true)}>Create post</button>
            </div>
          </div>
        ) : posts.map(post => (
          <article key={post.id} className="ch-post ch-card">
            <PostCard post={post} currentUser={user} onLike={() => toggleLike(post.id)} onDelete={() => deletePost(post.id)} onReport={() => reportPost(post.id)} onComment={addComment} likeAnimating={!!likeAnimating[post.id]} />
          </article>
        ))}
      </div>

      {composerOpen && <Composer onClose={() => setComposerOpen(false)} onCreate={handleCreate} currentUser={user} />}
    </div>
  );
}

function PostCard({ post, currentUser, onLike, onDelete, onReport, onComment, likeAnimating }) {
  const author = post.author || { full_name: 'Unknown', avatar_url: '/default-avatar.png' };
  const createdAt = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : '';
  const commentCount = post.commentCount || 0;
  const likeCount = post.likeCount || 0;

  return (
    <>
      <header className="ch-meta">
        <img src={post.anonymous ? '/default-avatar.png' : (author.avatar_url || '/default-avatar.png')} alt={author.full_name} />
        <div className="ch-who">
          <div className="ch-name">{post.anonymous ? (post.author ? 'Anonymous' : 'Guest') : author.full_name}</div>
          <div className="ch-time ch-muted">{createdAt} · {(post.tags || []).slice(0,3).join(' · ')}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {currentUser && (currentUser.uid === post.author_id) && (
            <button className="ch-btn-action" onClick={onDelete} title="Delete"><IconTrash size={16} /></button>
          )}
          <button className="ch-btn-action" onClick={onReport} title="Report"><IconFlag size={16} /></button>
        </div>
      </header>

      <div className="ch-title">{post.title}</div>
      <div className="ch-body">{post.body}</div>

      {post.attachments?.map((a, i) => (
        <div className="ch-attachments" key={i}><img src={a.url} alt={a.name} /></div>
      ))}

      <div className="ch-actions-row">
        <div className="ch-left">
          <button className={`ch-btn-action ch-like-anim ${likeAnimating ? 'ch-liked' : ''}`} onClick={onLike}>
            <IconHeart size={16} /> <span>{likeCount}</span>
          </button>

          <button className="ch-btn-action" title="Comments"><IconMessage size={16} /> <span>{commentCount}</span></button>
        </div>
        <div className="ch-visibility ch-muted">{post.visibility}</div>
      </div>

      <div className="ch-comment-row">
        <input placeholder="Write a comment..." id={`comment-${post.id}`} />
        <button onClick={() => {
          const el = document.getElementById(`comment-${post.id}`);
          if (!el || !el.value.trim()) return;
          onComment(post.id, el.value.trim());
          el.value = '';
        }}>Reply</button>
      </div>
    </>
  );
}

function Composer({ onClose, onCreate, currentUser }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const tags = useMemo(() => tagsInput.split(',').map(t => t.trim()).filter(Boolean), [tagsInput]);

  async function submit() {
    if (!title && !body) return alert('Add a title or some content');
    setLoading(true);
    const res = await onCreate({ title, body, tags, file, anonymous });
    setLoading(false);
    if (res.success) { setTitle(''); setBody(''); setTagsInput(''); setFile(null); setAnonymous(false); onClose(); }
    else alert('Error creating post');
  }

  return (
    <>
      <div className="ch-composer-backdrop" onClick={onClose} />
      <div className="ch-composer ch-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Create post</h3>
          <button onClick={onClose} className="ch-btn-ghost"><IconX /></button>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <textarea rows={5} value={body} onChange={e => setBody(e.target.value)} placeholder="Write something to the community..." />
          <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tags, comma separated" />
          <label className="file-label">
            <IconUpload /> <span className="ch-muted">Attach file</span>
            <input type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
            <span className="ch-small ch-muted" style={{ marginLeft: 10 }}>{file?.name}</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} /> Post as anonymous
          </label>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' }}>
            <div className="ch-small ch-muted">Posting as {currentUser?.email || 'guest'}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} className="ch-btn-ghost">Cancel</button>
              <button onClick={submit} className="ch-btn-primary">{loading ? 'Posting...' : 'Post'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MemberList() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'profiles'), limit(8)));
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setMembers(data);
      } catch (err) { console.warn(err); }
    })();
  }, []);

  return (
    <>
      {members.map(m => (
        <div key={m.id} className="ch-member">
          <img src={m.avatar_url || '/default-avatar.png'} alt={m.first_name || m.full_name} />
          <div style={{ fontWeight: 600 }}>{m.first_name || m.full_name || 'Member'}</div>
        </div>
      ))}
    </>
  );
}

function EventsPreview() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'events'), orderBy('start_at', 'asc'), limit(5)));
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setEvents(data);
      } catch (err) { console.warn(err); }
    })();
  }, []);

  return (
    <>
      {events.length === 0 ? <div className="ch-muted">No upcoming events</div> : events.map(ev => (
        <div key={ev.id} style={{ padding: 8, background: 'linear-gradient(180deg, rgba(255,255,255,0.01), transparent)', borderRadius: 10 }}>
          <div style={{ fontWeight: 700 }}>{ev.title}</div>
          <div className="ch-small ch-muted">{new Date(ev.start_at).toLocaleString()}</div>
        </div>
      ))}
    </>
  );
}
