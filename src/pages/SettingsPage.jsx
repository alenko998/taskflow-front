import { useState } from "react";
import TopBar from "../components/layout/TopBar";
import { Card, Button, Input, Avatar, Badge } from "../components/ui";

const TABS = ["Profile", "Workspace", "Notifications", "Security"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <>
      <TopBar title="Settings" subtitle="Manage your account and workspace" />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid var(--border)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            fontFamily: "var(--fb)", fontSize: ".82rem", fontWeight: 500,
            padding: "10px 20px", background: "none", border: "none",
            borderBottom: `2px solid ${activeTab === tab ? "var(--acc)" : "transparent"}`,
            color: activeTab === tab ? "var(--acc)" : "var(--text-2)",
            cursor: "pointer", transition: "all var(--t)",
          }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Profile" && <ProfileTab />}
      {activeTab === "Workspace" && <WorkspaceTab />}
      {activeTab === "Notifications" && <NotificationsTab />}
      {activeTab === "Security" && <SecurityTab />}
    </>
  );
}

function ProfileTab() {
  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 24 }}>
      <Card padding="24px">
        <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
          Profile Information
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <Avatar name="Alen Smrkovic" size={64} />
          <div>
            <Button variant="secondary" size="sm">Change Avatar</Button>
            <p style={{ fontSize: ".75rem", color: "var(--text-3)", marginTop: 6 }}>JPG, PNG or GIF · Max 2MB</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="First Name" defaultValue="Alen" />
            <Input label="Last Name"  defaultValue="Smrkovic" />
          </div>
          <Input label="Email" type="email" defaultValue="alen@taskflow.com" />
          <Input label="Job Title" placeholder="e.g. Frontend Developer" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function WorkspaceTab() {
  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 24 }}>
      <Card padding="24px">
        <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
          Workspace Settings
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Workspace Name" defaultValue="Acme Corp" />
          <Input label="Workspace URL" defaultValue="acme-corp" hint="taskflow.app/acme-corp" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Plan</label>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-2)" }}>
              <div>
                <div style={{ fontSize: ".9rem", fontWeight: 500, color: "var(--text)" }}>Free Plan</div>
                <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>5 members · 10 projects</div>
              </div>
              <Button variant="outline" size="sm">Upgrade</Button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>

      <Card padding="24px" style={{ border: "1px solid rgba(239,68,68,.2)" }}>
        <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--danger)", marginBottom: 8 }}>
          Danger Zone
        </h3>
        <p style={{ fontSize: ".85rem", color: "var(--text-3)", marginBottom: 16, lineHeight: 1.6 }}>
          Once you delete a workspace, there is no going back. Please be certain.
        </p>
        <Button variant="danger">Delete Workspace</Button>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    taskAssigned:    true,
    taskCompleted:   true,
    commentAdded:    true,
    projectUpdated:  false,
    weeklyDigest:    true,
    memberJoined:    false,
  });

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: "taskAssigned",   label: "Task assigned to me",       desc: "When someone assigns a task to you" },
    { key: "taskCompleted",  label: "Task completed",            desc: "When a task you created is marked done" },
    { key: "commentAdded",   label: "New comment",               desc: "When someone comments on your task" },
    { key: "projectUpdated", label: "Project updates",           desc: "When a project you're on is updated" },
    { key: "weeklyDigest",   label: "Weekly digest",             desc: "A weekly summary of your activity" },
    { key: "memberJoined",   label: "New member joined",         desc: "When someone joins your workspace" },
  ];

  return (
    <div style={{ maxWidth: 560 }}>
      <Card padding="0">
        {items.map((item, i) => (
          <div key={item.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div>
              <div style={{ fontSize: ".88rem", fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{item.desc}</div>
            </div>
            <div
              onClick={() => toggle(item.key)}
              style={{
                width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                background: prefs[item.key] ? "var(--acc)" : "var(--border-2)",
                position: "relative", transition: "background var(--t)", flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute", top: 3, left: prefs[item.key] ? 21 : 3,
                width: 16, height: 16, borderRadius: "50%", background: "#fff",
                transition: "left var(--t)",
              }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SecurityTab() {
  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 24 }}>
      <Card padding="24px">
        <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
          Change Password
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <Input label="New Password"     type="password" placeholder="••••••••" />
          <Input label="Confirm Password" type="password" placeholder="••••••••" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button>Update Password</Button>
          </div>
        </div>
      </Card>

      <Card padding="24px">
        <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
          Two-Factor Authentication
        </h3>
        <p style={{ fontSize: ".85rem", color: "var(--text-3)", marginBottom: 16, lineHeight: 1.6 }}>
          Add an extra layer of security to your account.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Badge variant="warning">Not enabled</Badge>
          <Button variant="outline" size="sm">Enable 2FA</Button>
        </div>
      </Card>

      <Card padding="24px">
        <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
          Active Sessions
        </h3>
        {[
          { device: "MacBook Air · Chrome",  location: "Belgrade, Serbia", time: "Active now" },
          { device: "iPhone 15 · Safari",    location: "Belgrade, Serbia", time: "2 hours ago" },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: i === 0 ? "1px solid var(--border)" : "none",
          }}>
            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--text)" }}>{s.device}</div>
              <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{s.location} · {s.time}</div>
            </div>
            {i !== 0 && <Button variant="ghost" size="sm">Revoke</Button>}
            {i === 0 && <Badge variant="success" size="sm">Current</Badge>}
          </div>
        ))}
      </Card>
    </div>
  );
}
