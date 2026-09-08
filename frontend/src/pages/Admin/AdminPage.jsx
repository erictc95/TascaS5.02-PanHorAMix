import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import api from "../../api/axiosConfig";
import mediaService from "../../api/mediaService";
import phamBackIcon from "../../assets/icons/pham-back-icon.png";

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [media, setMedia] = useState([]);

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingMedia, setLoadingMedia] = useState(true);

    const [usersError, setUsersError] = useState("");
    const [mediaError, setMediaError] = useState("");

    const [changingRole, setChangingRole] = useState(null);

    const [mediaToDelete, setMediaToDelete] = useState(null);
    const [directorNote, setDirectorNote] = useState("");

    const [deletingMedia, setDeletingMedia] = useState(false);

    const [userToDelete, setUserToDelete] = useState(null);
    const [deletingUser, setDeletingUser] = useState(false);
    const [roleChangeConfirmation, setRoleChangeConfirmation] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
        loadMedia();
    }, []);

    async function loadUsers() {
        try {
            setLoadingUsers(true);
            setUsersError("");

            const response = await api.get("/admin/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to load admin users:", error);
            setUsersError("Failed to load users.");
        } finally {
            setLoadingUsers(false);
        }
    }

    function changeUserRole(userId, newRole) {
        const user = users.find((item) => item.id === userId);

        if (!user) {
            return;
        }

        setRoleChangeConfirmation({
            userId,
            newRole,
            user
        });
    }

    function closeRoleChangeConfirmation() {
        setRoleChangeConfirmation(null);
    }

    async function confirmRoleChange() {
        if (!roleChangeConfirmation) {
            return;
        }

        const {
            userId,
            newRole
        } = roleChangeConfirmation;

        try {
            setChangingRole(userId);
            setUsersError("");

            const response = await api.patch(
                `/admin/users/${userId}/role`,
                null,
                {
                    params: {
                        role: newRole
                    }
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item.id === userId
                        ? response.data
                        : item
                )
            );

            setRoleChangeConfirmation(null);

        } catch (error) {
            console.error(
                "Failed to change user role:",
                error
            );

            if (error.response?.status === 403) {
                setUsersError(
                    "You cannot remove the last administrator."
                );
            } else {
                setUsersError(
                    "Failed to change user role."
                );
            }

        } finally {
            setChangingRole(null);
        }
    }

    async function loadMedia() {
        try {
            setLoadingMedia(true);
            setMediaError("");

            const response = await api.get("/admin/media");
            setMedia(response.data.content || []);
        } catch (error) {
            console.error("Failed to load admin media:", error);
            setMediaError("Failed to load media.");
        } finally {
            setLoadingMedia(false);
        }
    }

    function openDeleteModal(item) {
        setMediaToDelete(item);
        setDirectorNote("");
    }

    function closeDeleteModal() {
        setMediaToDelete(null);
        setDirectorNote("");
    }

    async function confirmDeleteMedia() {
        if (!mediaToDelete || !directorNote.trim()) {
            return;
        }

        try {
            setDeletingMedia(true);

            await mediaService.deleteAdminMedia(
                mediaToDelete.id,
                directorNote.trim()
            );

            setMedia((currentMedia) =>
                currentMedia.filter((item) => item.id !== mediaToDelete.id)
            );

            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete admin media:", error);
            setMediaError("Failed to delete media.");
        } finally {
            setDeletingMedia(false);
        }
    }

    function openDeleteUserModal(user) {
        setUserToDelete(user);
        setDirectorNote("");
    }

    function closeDeleteUserModal() {
        setUserToDelete(null);
        setDirectorNote("");
    }

    async function confirmDeleteUser() {
        if (!userToDelete || !directorNote.trim()) {
            return;
        }

        try {
            setDeletingUser(true);

            await api.delete(
                `/admin/users/${userToDelete.id}`,
                {
                    data: {
                        directorNote: directorNote.trim()
                    }
                }
            );

            setUsers((current) =>
                current.filter(
                    (user) => user.id !== userToDelete.id
                )
            );

            await loadMedia();

            closeDeleteUserModal();

        } catch (error) {
            setUsersError("Failed to delete user.");
        } finally {
            setDeletingUser(false);
        }
    }

    const adminCount = users.filter(
        (user) => user.role === "ADMIN"
    ).length;

    return (
        <div className="admin-page">

            <button
                type="button"
                className="admin-back-button"
                onClick={() => navigate("/profile")}
            >
                <img
                    src={phamBackIcon}
                    alt="PHAM Back"
                />
            </button>

            <h1>Admin Panel</h1>

            <section className="admin-section">
                <h2>Users</h2>

                {loadingUsers && (
                    <p>Loading users...</p>
                )}

                {usersError && (
                    <p className="admin-error">{usersError}</p>
                )}

                {!loadingUsers && !usersError && users.length === 0 && (
                    <p>No users found.</p>
                )}

                {!loadingUsers && !usersError && users.length > 0 && (
                    <div className="admin-users-table-wrapper">
                        <table className="admin-users-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Name</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {[user.firstName, user.lastName]
                                            .filter(Boolean)
                                            .join(" ") || "—"}
                                    </td>
                                    <td>
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td>
                                        {user.deletedAt ? "Deleted" : "Active"}
                                    </td>
                                    <td>
                                        {user.role === "USER" ? (
                                            <button
                                                type="button"
                                                className="admin-role-button"
                                                disabled={changingRole === user.id}
                                                onClick={() => changeUserRole(user.id, "ADMIN")}
                                            >
                                                {changingRole === user.id
                                                    ? "Updating..."
                                                    : "Make Admin"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="admin-role-button admin-role-button-user"
                                                disabled={
                                                    adminCount <= 1 ||
                                                    changingRole === user.id
                                                }
                                                title={
                                                    adminCount <= 1
                                                        ? "At least one administrator must remain."
                                                        : "Make User"
                                                }
                                                onClick={() => changeUserRole(user.id, "USER")}
                                            >
                                                {changingRole === user.id
                                                    ? "Updating..."
                                                    : "Make User"}
                                            </button>
                                        )}
                                        <button
                                            className="admin-delete-button"
                                            onClick={() => openDeleteUserModal(user)}
                                        >
                                            Delete User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="admin-section">
                <h2>Media</h2>

                {loadingMedia && (
                    <p>Loading media...</p>
                )}

                {mediaError && (
                    <p className="admin-error">{mediaError}</p>
                )}

                {!loadingMedia && !mediaError && media.length === 0 && (
                    <p>No media found.</p>
                )}

                {!loadingMedia && !mediaError && media.length > 0 && (
                    <div className="admin-media-table-wrapper">
                        <table className="admin-media-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Owner</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Visibility</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {media.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.title || "—"}</td>
                                    <td>
                                        {item.user?.username || item.username || "—"}
                                    </td>
                                    <td>{item.mediaType || "—"}</td>
                                    <td>{item.category || "—"}</td>
                                    <td>{item.visibility || "—"}</td>
                                    <td>
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="admin-delete-button"
                                            onClick={() => openDeleteModal(item)}
                                        >
                                            Delete Media
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {mediaToDelete && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Delete Media</h2>

                        <p>
                            You are about to permanently delete:
                        </p>

                        <p className="admin-modal-media-title">
                            "{mediaToDelete.title || "Untitled"}"
                        </p>

                        <label htmlFor="director-note">
                            Director's Note
                        </label>

                        <textarea
                            id="director-note"
                            value={directorNote}
                            onChange={(event) => setDirectorNote(event.target.value)}
                            placeholder="Explain why this media is being removed..."
                            rows={5}
                        />

                        <div className="admin-modal-actions">
                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-delete-button"
                                disabled={!directorNote.trim() || deletingMedia}
                                onClick={confirmDeleteMedia}
                            >
                                {deletingMedia ? "Deleting..." : "Delete Media"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userToDelete && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">

                        <h2>Delete User</h2>

                        <p>
                            You are about to permanently delete
                            <strong> @{userToDelete.username}</strong>.
                        </p>

                        <p>
                            This will permanently delete the user's account
                            and all of their media.
                        </p>

                        <label>
                            Director's Note
                        </label>

                        <textarea
                            value={directorNote}
                            onChange={(event) =>
                                setDirectorNote(event.target.value)
                            }
                            placeholder="Explain why this account is being removed..."
                            rows={6}
                        />

                        <div className="admin-modal-actions">

                            <button
                                className="admin-cancel-button"
                                onClick={closeDeleteUserModal}
                                disabled={deletingUser}
                            >
                                Cancel
                            </button>

                            <button
                                className="admin-delete button"
                                onClick={confirmDeleteUser}
                                disabled={
                                    deletingUser ||
                                    !directorNote.trim()
                                }
                            >
                                {deletingUser
                                    ? "DELETING..."
                                    : "DELETE USER"}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {roleChangeConfirmation && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">

                        <h2>
                            {roleChangeConfirmation.newRole === "ADMIN"
                                ? "Make Admin"
                                : "Make User"}
                        </h2>

                        <p>
                            Are you sure you want to{" "}
                            {roleChangeConfirmation.newRole === "ADMIN"
                                ? "make this user an administrator"
                                : "make this administrator a regular user"}?
                        </p>

                        <p>
                            <strong>
                                Username: {roleChangeConfirmation.user.username}
                            </strong>
                        </p>

                        <div className="admin-modal-actions">

                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={closeRoleChangeConfirmation}
                                disabled={
                                    changingRole ===
                                    roleChangeConfirmation.userId
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-role-button"
                                onClick={confirmRoleChange}
                                disabled={
                                    changingRole ===
                                    roleChangeConfirmation.userId
                                }
                            >
                                {changingRole ===
                                roleChangeConfirmation.userId
                                    ? "Updating..."
                                    : "Confirm"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;