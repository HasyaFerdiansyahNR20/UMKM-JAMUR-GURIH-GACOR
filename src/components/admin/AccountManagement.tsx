"use client";

import React, { useState } from "react";
import { StaffAccount, OwnerSecurityConfig } from "@/lib/accountStore";
import {
  updateOwnerSecurityAction,
  createAdminAccountAction,
  updateAdminAccountAction,
  deleteAdminAccountAction,
  testSmtpEmailAction,
} from "@/actions/auth";
import {
  ShieldCheck,
  UserPlus,
  Mail,
  User,
  Lock,
  Trash2,
  Edit2,
  CheckCircle2,
  KeyRound,
  Save,
  UserMinus,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface AccountManagementProps {
  initialOwner: OwnerSecurityConfig;
  initialAdmins: StaffAccount[];
}

export const AccountManagement: React.FC<AccountManagementProps> = ({
  initialOwner,
  initialAdmins,
}) => {
  // Owner security & 2 recovery emails + SMTP Gmail state
  const [ownerEmail, setOwnerEmail] = useState(initialOwner.email);
  const [ownerUsername, setOwnerUsername] = useState(initialOwner.username);
  const [ownerNewPass, setOwnerNewPass] = useState("");
  const [recoveryPrimary, setRecoveryPrimary] = useState(
    initialOwner.recoveryEmailPrimary
  );
  const [recoverySecondary, setRecoverySecondary] = useState(
    initialOwner.recoveryEmailSecondary
  );
  const [smtpEmail, setSmtpEmail] = useState(initialOwner.smtpEmail || "");
  const [smtpAppPassword, setSmtpAppPassword] = useState(
    initialOwner.smtpAppPassword || ""
  );
  const [isSavingOwner, setIsSavingOwner] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [ownerSavedMsg, setOwnerSavedMsg] = useState("");
  const [ownerErrorMsg, setOwnerErrorMsg] = useState("");

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setOwnerSavedMsg("");
    setOwnerErrorMsg("");
    try {
      const targetEmail =
        admins[0]?.email || recoveryPrimary || smtpEmail;
      const res = await testSmtpEmailAction({
        smtpEmail,
        smtpAppPassword,
        testRecipient: targetEmail,
      });
      if (res.success) {
        setOwnerSavedMsg(
          res.message || `Berhasil! Email tes OTP terkirim ke ${targetEmail}.`
        );
      } else {
        setOwnerErrorMsg(res.error || "Gagal mengirim email tes.");
      }
    } catch {
      setOwnerErrorMsg("Terjadi kesalahan saat menguji pengiriman email.");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Admin accounts state
  const [admins, setAdmins] = useState<StaffAccount[]>(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<StaffAccount | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [adminErrorMsg, setAdminErrorMsg] = useState("");

  const handleSaveOwnerSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingOwner(true);
    setOwnerSavedMsg("");
    setOwnerErrorMsg("");

    try {
      const res = await updateOwnerSecurityAction({
        email: ownerEmail,
        username: ownerUsername,
        newPassword: ownerNewPass.trim() ? ownerNewPass.trim() : undefined,
        recoveryEmailPrimary: recoveryPrimary,
        recoveryEmailSecondary: recoverySecondary,
        smtpEmail,
        smtpAppPassword,
      });

      if (!res.success) {
        setOwnerErrorMsg(res.error || "Gagal menyimpan pengaturan keamanan Owner.");
      } else {
        setOwnerNewPass("");
        setOwnerSavedMsg(
          "Pengaturan akun Owner, 2 Email Pemulihan, dan Pengirim OTP berhasil disimpan!"
        );
        setTimeout(() => setOwnerSavedMsg(""), 4000);
      }
    } catch (err) {
      setOwnerErrorMsg("Terjadi kesalahan saat menyimpan data Owner.");
    } finally {
      setIsSavingOwner(false);
    }
  };

  const handleOpenAddAdmin = () => {
    setEditingAdmin(null);
    setAdminEmail("");
    setAdminUsername("");
    setAdminPassword("");
    setAdminErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEditAdmin = (acc: StaffAccount) => {
    setEditingAdmin(acc);
    setAdminEmail(acc.email);
    setAdminUsername(acc.username);
    setAdminPassword(acc.password);
    setAdminErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAdmin(true);
    setAdminErrorMsg("");

    try {
      if (editingAdmin) {
        const res = await updateAdminAccountAction({
          id: editingAdmin.id,
          email: adminEmail,
          username: adminUsername,
          password: adminPassword,
        });
        if (!res.success) {
          setAdminErrorMsg(res.error || "Gagal memperbarui akun karyawan.");
          setIsSubmittingAdmin(false);
          return;
        }
        setAdmins((prev) =>
          prev.map((a) =>
            a.id === editingAdmin.id
              ? {
                  ...a,
                  email: adminEmail,
                  username: adminUsername,
                  password: adminPassword,
                }
              : a
          )
        );
      } else {
        const res = await createAdminAccountAction({
          email: adminEmail,
          username: adminUsername,
          password: adminPassword,
        });
        if (!res.success || !res.account) {
          setAdminErrorMsg(res.error || "Gagal membuat akun karyawan.");
          setIsSubmittingAdmin(false);
          return;
        }
        setAdmins((prev) => [res.account!, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setAdminErrorMsg("Terjadi kesalahan saat menyimpan akun karyawan.");
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (acc: StaffAccount) => {
    if (
      !confirm(
        `Hapus akun karyawan "${acc.username}" (${acc.email})?\n\nSetelah dihapus (misal karena resign), karyawan ini tidak akan bisa login lagi dan emailnya tidak akan menerima kode OTP.`
      )
    )
      return;
    try {
      const res = await deleteAdminAccountAction(acc.id);
      if (res.success) {
        setAdmins((prev) => prev.filter((a) => a.id !== acc.id));
      } else {
        alert(res.error || "Gagal menghapus akun karyawan.");
      }
    } catch (err) {
      alert("Gagal menghapus akun karyawan.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* BAGIAN 1: MANAJEMEN AKUN KARYAWAN / ADMIN (ROLE)  */}
      {/* ================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Manajemen Akun Karyawan / Admin (Penerima OTP Login)
              </h3>
              <p className="text-xs text-stone-500">
                Saat karyawan login, <strong>Kode OTP</strong> dikirim ke <strong>Email Karyawan</strong> sekaligus ke <strong>Email Owner</strong>. Jika karyawan <strong>resign</strong>, klik tombol <strong>Hapus (Resign)</strong> untuk mencabut aksesnya.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddAdmin}
            className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Buat Akun Karyawan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="py-3 px-4">Username Karyawan</th>
                <th className="py-3 px-4">Email Penerima OTP Login</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Role &amp; Hak Akses</th>
                <th className="py-3 px-4 text-right">Aksi (Edit / Resign)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    Belum ada akun karyawan terdaftar. Klik tombol &ldquo;+ Buat Akun Karyawan&rdquo; di atas.
                  </td>
                </tr>
              ) : (
                admins.map((acc) => (
                  <tr key={acc.id} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      {acc.username}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-800 block">
                        {acc.email}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        ✓ Menerima Kode OTP Login (+ Tembusan ke Owner)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <code className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold">
                        {acc.password}
                      </code>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-800">
                        ADMIN (Stok &amp; Pesanan)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditAdmin(acc)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                          title="Edit Email OTP / Password Karyawan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(acc)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                          title="Hapus Akun Karyawan (Resign)"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          <span>Hapus (Resign)</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================= */}
      {/* BAGIAN 2: AKUN OWNER, 2 EMAIL PEMULIHAN & SMTP    */}
      {/* ================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <KeyRound className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-stone-900">
              Keamanan Akun Owner &amp; Email Pemulihan
            </h3>
            <p className="text-xs text-stone-500">
              Atur Email Owner (penerima OTP Owner &amp; tembusan OTP Karyawan) serta 2 Email Pemulihan Password.
            </p>
          </div>
        </div>

        {ownerSavedMsg && (
          <div className="my-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{ownerSavedMsg}</span>
          </div>
        )}

        {ownerErrorMsg && (
          <div className="my-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
            {ownerErrorMsg}
          </div>
        )}

        <form onSubmit={handleSaveOwnerSecurity} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Username Login Owner
              </label>
              <input
                type="text"
                required
                value={ownerUsername}
                onChange={(e) => setOwnerUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Email Utama Owner (Penerima OTP)
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Ganti Password Owner (Opsional)
              </label>
              <input
                type="password"
                value={ownerNewPass}
                onChange={(e) => setOwnerNewPass(e.target.value)}
                placeholder="Kosongkan jika tidak diganti"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-amber-900 uppercase mb-1">
                1. Email Pemulihan Utama (Primary Recovery Email) *
              </label>
              <input
                type="email"
                required
                value={recoveryPrimary}
                onChange={(e) => setRecoveryPrimary(e.target.value)}
                placeholder="Contoh: admin@gurihgacor.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-amber-900 uppercase mb-1">
                2. Email Pemulihan Alternatif (Secondary Recovery Email) *
              </label>
              <input
                type="email"
                required
                value={recoverySecondary}
                onChange={(e) => setRecoverySecondary(e.target.value)}
                placeholder="Contoh: fnrhasya@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Konfigurasi Pengirim Email OTP */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                Konfigurasi Pengirim Email OTP
              </h4>

              <button
                type="button"
                disabled={isTestingSmtp || !smtpEmail || !smtpAppPassword}
                onClick={handleTestSmtp}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm shrink-0 cursor-pointer"
              >
                {isTestingSmtp ? "Mengirim Tes..." : "✉️ Tes Kirim Email OTP"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Alamat Email Pengirim
                </label>
                <input
                  type="email"
                  value={smtpEmail}
                  onChange={(e) => setSmtpEmail(e.target.value)}
                  placeholder="Contoh: jamurgurihgacor@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  16-Digit Google App Password (Sandi Aplikasi)
                </label>
                <input
                  type="password"
                  value={smtpAppPassword}
                  onChange={(e) => setSmtpAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingOwner}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>
                {isSavingOwner
                  ? "Menyimpan..."
                  : "Simpan Pengaturan Owner"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal Tambah / Edit Akun Karyawan */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            editingAdmin
              ? "Edit Akun Karyawan & Email OTP"
              : "Buat Akun Karyawan Baru (Role: Admin)"
          }
          maxWidth="md"
        >
          <form onSubmit={handleSubmitAdmin} className="space-y-4">
            {adminErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold">
                {adminErrorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Username Karyawan *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Contoh: budi_kasir"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Email Karyawan (Penerima Kode OTP Login) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Contoh: emailkaryawan@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Saat karyawan ini login, kode OTP akan dikirim ke email ini <strong>dan juga ke email Owner</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Password Karyawan *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  minLength={4}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmittingAdmin}
                className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
              >
                {isSubmittingAdmin ? "Menyimpan..." : "Simpan Akun Karyawan"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
