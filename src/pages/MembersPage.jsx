import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui";
import { workspaceApi } from "../api";
import { isAdmin, isOwner } from "../utils/roles";
import TopBar from "../components/layout/TopBar";
import { Badge, Avatar, Button, Modal, Input, Card } from "../components/ui";

const ROLE_LABELS  = { 0: "Owner", 1: "Admin", 2: "Member" };
const ROLE_COLORS  = { 0: "accent", 1: "teal", 2: "default" };

export default function MembersPage() {
  const { user }  = useAuth();
  const toast     = useToast();
  const [members, setMembers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [inviting, setInviting]     = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "2" });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await workspaceApi.getMembers();
      setMembers(res.data);
    } catch {
      toast("Failed to load members.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteForm.email) { toast("Email is required.", "error"); return; }
    setInviting(true);
    try {
      await workspaceApi.inviteMember({ email: inviteForm.email, role: parseInt(inviteForm.role) });
      toast("Invitation sent!", "success");
      setShowInvite(false);
      setInviteForm({ email: "", role: "2" });
    } catch (err) {
      toast(err.response?.data?.message || "Failed to send invitation.", "error");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await workspaceApi.removeMember(userId);
      toast("Member removed.", "success");
      setSelected(null);
      fetchMembers();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to remove member.", "error");
    }
  };

  const filtered = members.filter(m =>
    m.firstName.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar
        title="Members"
        subtitle={`${members.length} members in workspace`}
        actions={isAdmin(user) && (
          <Button onClick={() => setShowInvite(true)}>+ Invite Member</Button>
        )}
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Members", value: members.length,                           color: "var(--text-2)" },
          { label: "Admins",        value: members.filter(m => m.role < 2).length,   color: "var(--acc)" },
          { label: "Members",       value: members.filter(m => m.role === 2).length, color: "var(--teal)" },
        ].map(s => (
          <Card key={s.label} padding="20px">
            <div style={{ fontSize: "1.8rem", fontWeight: 600, color: s.color, fontFamily: "var(--fd)", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: ".78rem", color: "var(--text-3)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div style={{ maxWidth: 320, marginBottom: 20 }}>
        <Input placeholder="Search members..." value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<span style={{ fontSize: ".85rem" }}>🔍</span>} />
      </div>

      {loading && <p style={{ color: "var(--text-3)" }}>Loading members...</p>}

      {!loading && (
        <Card padding="0">
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 120px",
            gap: 12, padding: "10px 24px", borderBottom: "1px solid var(--border)",
            fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em",
            textTransform: "uppercase", color: "var(--text-3)",
          }}>
            <div>Member</div><div>Role</div><div>Joined</div>
          </div>

          {filtered.map((m, i) => (
            <div key={m.userId} onClick={() => setSelected(m)} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 120px",
              gap: 12, padding: "16px 24px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center", cursor: "pointer", transition: "background var(--t)",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={`${m.firstName} ${m.lastName}`} size={36} />
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 500, color: "var(--text)" }}>{m.firstName} {m.lastName}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{m.email}</div>
                </div>
              </div>
              <div><Badge variant={ROLE_COLORS[m.role]} size="sm">{ROLE_LABELS[m.role]}</Badge></div>
              <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>
                {new Date(m.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-3)", fontSize: ".88rem" }}>
              No members found.
            </div>
          )}
        </Card>
      )}

      {/* Invite Modal */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button loading={inviting} onClick={handleInvite}>Send Invite</Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email Address" type="email" placeholder="colleague@company.com"
            value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Role</label>
            <select value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))} style={{
              background: "var(--surface-2)", border: "1px solid var(--border-2)",
              borderRadius: "var(--radius-sm)", color: "var(--text)",
              fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px", outline: "none",
            }}>
              <option value="2">Member</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <p style={{ fontSize: ".82rem", color: "var(--text-3)", lineHeight: 1.6 }}>
            An invitation email will be sent. They'll need to create an account to join.
          </p>
        </div>
      </Modal>

      {/* Member Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Member Details"
        footer={
          <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "space-between" }}>
            <div>
              {isAdmin(user) && selected?.role !== 0 && selected?.userId !== user?.userId && (
                <Button variant="danger" size="sm" onClick={() => handleRemove(selected.userId)}>Remove</Button>
              )}
            </div>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
          </div>
        }
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={`${selected.firstName} ${selected.lastName}`} size={56} />
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{selected.firstName} {selected.lastName}</div>
                <div style={{ fontSize: ".85rem", color: "var(--text-3)" }}>{selected.email}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 4 }}>Role</label>
                <Badge variant={ROLE_COLORS[selected.role]}>{ROLE_LABELS[selected.role]}</Badge>
              </div>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 4 }}>Joined</label>
                <span style={{ fontSize: ".9rem", color: "var(--text-2)" }}>
                  {new Date(selected.joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
