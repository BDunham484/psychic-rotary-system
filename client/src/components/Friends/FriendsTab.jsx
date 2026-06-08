import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_FRIEND_BY_USERNAME,
  REMOVE_FRIEND,
  BLOCK_USER,
  UNBLOCK_USER,
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  CANCEL_FRIEND_REQUEST,
} from '../../utils/mutations';
import { Search } from '@styled-icons/feather/Search';
import { Check }  from '@styled-icons/feather/Check';
import { X }      from '@styled-icons/feather/X';
import FriendItem from './FriendItem';
import styles from './FriendsTab.module.css';

const FriendsTab = ({ user }) => {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [addFriendByUsername] = useMutation(ADD_FRIEND_BY_USERNAME);
  const [removeFriend]        = useMutation(REMOVE_FRIEND);
  const [blockUser]           = useMutation(BLOCK_USER);
  const [unblockUser]         = useMutation(UNBLOCK_USER);
  const [acceptRequest]       = useMutation(ACCEPT_FRIEND_REQUEST);
  const [declineRequest]      = useMutation(DECLINE_FRIEND_REQUEST);
  const [cancelRequest]       = useMutation(CANCEL_FRIEND_REQUEST);

  const friends  = user.friends          || [];
  const received = user.receivedRequests || [];
  const sent     = user.sentRequests     || [];
  const blocked  = user.blockedUsers     || [];

  const filtered = friends.filter(f =>
    f.username.toLowerCase().includes(query.toLowerCase())
  );

  const isExistingFriend = friends.some(
    f => f.username.toLowerCase() === query.trim().toLowerCase()
  );

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isExistingFriend) return;
    try {
      await addFriendByUsername({ variables: { username: query.trim() } });
      setQuery('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className={styles.layout}>
      <div>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search friends or send a friend request…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className={styles.searchSubmit}
            disabled={!query.trim() || isExistingFriend}
          >Add</button>
        </form>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Friends</span>
          <span className={styles.sectionCount}>{filtered.length} of {friends.length}</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={query ? 'No matches' : 'No friends yet'}
            sub={query ? 'Try a different username.' : 'Send a friend request to get started.'}
          />
        ) : (
          <div className={styles.list}>
            {filtered.map(f => (
              <FriendItem
                key={f._id}
                friend={f}
                open={openId === f._id}
                setOpen={(v) => setOpenId(v ? f._id : null)}
                onRemove={() => removeFriend({ variables: { friendId: f._id } })}
                onBlock={() => blockUser({ variables: { blockedId: f._id } })}
              />
            ))}
          </div>
        )}
      </div>

      <aside className={styles.sidePanel}>
        <SideCard title="Received" count={received.length} emptyText="No pending requests">
          {received.map(r => (
            <CompactItem
              key={r._id}
              entry={r}
              sub="wants to be friends"
              actions={[
                { kind: 'success', icon: <Check />, label: 'Accept',  onClick: () => acceptRequest({ variables: { senderId: r._id, senderName: r.username } }) },
                { kind: 'danger',  icon: <X />,     label: 'Decline', onClick: () => declineRequest({ variables: { senderId: r._id, senderName: r.username } }) },
              ]}
            />
          ))}
        </SideCard>

        <SideCard title="Sent" count={sent.length} emptyText="No requests sent">
          {sent.map(r => (
            <CompactItem
              key={r._id}
              entry={r}
              sub="request pending"
              actions={[
                { kind: 'danger', icon: <X />, label: 'Cancel', onClick: () => cancelRequest({ variables: { friendId: r._id, friendName: r.username } }) },
              ]}
            />
          ))}
        </SideCard>

        <SideCard title="Blocked" count={blocked.length} emptyText="No blocked users">
          {blocked.map(b => (
            <CompactItem
              key={b._id}
              entry={b}
              sub="blocked"
              actions={[
                { kind: 'text', label: 'Unblock', onClick: () => unblockUser({ variables: { blockedId: b._id } }) },
              ]}
            />
          ))}
        </SideCard>
      </aside>
    </div>
  );
};

const SideCard =({ title, count, emptyText, children }) => (
  <div className={styles.sideCard}>
    <div className={styles.sideCardHeader}>
      <span className={styles.sideCardTitle}>{title}</span>
      <span className={styles.sideCardCount}>{count}</span>
    </div>
    <div className={styles.sideCardBody}>
      {count === 0 ? <div className={styles.sideEmpty}>{emptyText}</div> : children}
    </div>
  </div>
);

const CompactItem = ({ entry, sub, actions = [] }) => {
  const initials = (entry.username || '?').slice(0, 2).toUpperCase();
  return (
    <div className={styles.compactItem}>
      <div className={styles.compactAvatar}>{initials}</div>
      <div className={styles.compactInfo}>
        <div className={styles.compactName}>{entry.username}</div>
        <div className={styles.compactSub}>{sub}</div>
      </div>
      <div className={styles.compactActions}>
        {actions.map((a, i) => (
          <button
            key={i}
            className={`${styles.iconBtnSm} ${styles[`iconBtn_${a.kind}`] || ''}`}
            title={a.label}
            onClick={a.onClick}
          >
            {a.icon || a.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const EmptyState = ({ title, sub }) => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>∅</div>
    <div className={styles.emptyTitle}>{title}</div>
    <div className={styles.emptySub}>{sub}</div>
  </div>
);

export default FriendsTab;
