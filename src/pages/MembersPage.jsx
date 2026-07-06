import { useState } from "react";
import TopBar from "../components/layout/TopBar";
import { Badge, Avatar, Button, Modal, Input, Card } from "../components/ui";

const MEMBERS = [
  { id: 1, name: "Alen Smrkovic", email: "alen@taskflow.com",  role: "Owner",  joined: "Jan 1, 2026",  tasks: 8,  projects: 4, status: "Active" },
  { id: 2, name: "Sara Markovic", email: "sara@taskflow.com",  role: "Admin",  joined: "Jan 5, 2026",  tasks: 12, projects: 3, status: "Active" },
  { id: 3, name: "John Doe",      email: "john@taskflow.com",  role: "Member", joined: "Feb 1, 2026",  tasks: 6,  projects: 2, status: "Active" },
  { id: 4, name: "Amy Kim",       email: "amy@taskflow.com",   role: "Member", joined: "Feb 15, 2026", tasks: 4,  projects: 2, status: "Active" },
  { id: 5, name: "Mike Ross",     email: "mike@taskflow.com",  role: "Member", joined: "Mar 1, 2026",  tasks: 9,  projects: 3, status: "Active" },
  { id: 6, name: "Lisa Chen",     email: "lisa@taskflow.com",  role: "Member", joined: "Mar 10, 2026", tasks: 2,  projects: 1, status: "Invited" },
];

const ROLE_COLORS = { Owner: "accent", Admin: "teal", Member: "default" };
const STATUS_COLORS = { Active: "success", Invited: "warning" };

export default function MembersPage() {
  const [search, setSearch]         = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [selected, setSelected]     = useState(null);

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar
        title="Members"
        subtitle={`${MEMBERS.length} members in workspace`}
        actions={<Button onClick={() => setShowInvite(true)}>+ Invite Member</Button>}
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Members", value: MEMBERS.length,                                    color: "var(--text-2)" },
          { label: "Admins",        value: MEMBERS.filter(m => m.role !== "Member").length,   color: "var(--acc)" },
          { label: "Pending",       value: MEMBERS.filter(m => m.status === "Invited").length, color: "var(--warning)" },
        ].map(s => (
          <Card key={s.label} padding="20px">
            <div style={{ fontSize: "1.8rem", fontWeight: 600, color: s.color, fontFamily: "var(--fd)", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: ".78rem", color: "var(--text-3)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div style={{ maxWidth: 320, marginBottom: 20 }}>
        <Input
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<span style={{ fontSize: ".85rem" }}>🔍</span>}
        />
      </div>

      {/* Table */}
      <Card padding="0">
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 80px 80px 100px 80px",
          gap: 12, padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em",
          textTransform: "uppercase", color: "var(--text-3)",
        }}>
          <div>Member</div>
          <div>Role</div>
          <div>Tasks</div>
          <div>Projects</div>
          <div>Status</div>
          <div>Joined</div>
        </div>

        {filtered.map((m, i) => (
          <div key={m.id}
            onClick={() => setSelected(m)}
            style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 80px 80px 100px 80px",
              gap: 12, padding: "16px 24px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center", cursor: "pointer", transition: "background var(--t)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={m.name} size={36} />
              <div>
                <div style={{ fontSize: ".88rem", fontWeight: 500, color: "var(--text)" }}>{m.name}</div>
                <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{m.email}</div>
              </div>
            </div>
            <div><Badge variant={ROLE_COLORS[m.role]} size="sm">{m.role}</Badge></div>
            <div style={{ fontSize: ".85rem", color: "var(--text-2)" }}>{m.tasks}</div>
            <div style={{ fontSize: ".85rem", color: "var(--text-2)" }}>{m.projects}</div>
            <div><Badge variant={STATUS_COLORS[m.status]} size="sm">{m.status}</Badge></div>
            <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{m.joined.split(",")[0]}</div>
          </div>
        ))}
      </Card>

      {/* Invite Modal */}
      <Modal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={() => setShowInvite(false)}>Send Invite</Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email Address" type="email" placeholder="colleague@company.com" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Role</label>
            <select style={{
              background: "var(--surface-2)", border: "1px solid var(--border-2)",
              borderRadius: "var(--radius-sm)", color: "var(--text)",
              fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px", outline: "none",
            }}>
              <option>Member</option>
              <option>Admin</option>
            </select>
          </div>
          <p style={{ fontSize: ".82rem", color: "var(--text-3)", lineHeight: 1.6 }}>
            An invitation email will be sent. They'll need to create an account or sign in to join your workspace.
          </p>
        </div>
      </Modal>

      {/* Member Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Member Details"
        footer={
          <>
            {selected?.role !== "Owner" && (
              <Button variant="danger" size="sm">Remove</Button>
            )}
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
          </>
        }
      >
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={selected.name} size={56} />
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{selected.name}</div>
                <div style={{ fontSize: ".85rem", color: "var(--text-3)" }}>{selected.email}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Role",     value: selected.role },
                { label: "Status",   value: selected.status },
                { label: "Tasks",    value: selected.tasks },
                { label: "Projects", value: selected.projects },
                { label: "Joined",   value: selected.joined },
              ].map(item => (
                <div key={item.label}>
                  <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 4 }}>{item.label}</label>
                  <span style={{ fontSize: ".9rem", color: "var(--text-2)" }}>{item.value}</span>
                </div>
              ))}
            </div>
            {selected.role !== "Owner" && (
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 8 }}>Change Role</label>
                <select style={{
                  background: "var(--surface-2)", border: "1px solid var(--border-2)",
                  borderRadius: "var(--radius-sm)", color: "var(--text)",
                  fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px",
                  outline: "none", width: "100%",
                }} defaultValue={selected.role}>
                  <option>Member</option>
                  <option>Admin</option>
                </select>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
