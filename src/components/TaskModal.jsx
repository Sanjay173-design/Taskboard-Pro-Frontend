import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function TaskModal({ task, onClose }) {
  const { accessToken } = useAuth();

  const [taskData, setTaskData] = useState(task);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activity, setActivity] = useState([]);

  const [editTitle, setEditTitle] = useState(task.title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ⭐ NEW PREVIEW STATE */
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFileName, setPreviewFileName] = useState("");

  /* ⭐ FILE TYPE HELPER */
  const isImageFile = (name = "") => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);

  /* ---------------- LOAD DATA ---------------- */

  const loadTask = async () => {
    try {
      const [commentsRes, activityRes] = await Promise.all([
        apiFetch(`/tasks/comments?taskId=${task.taskId}`, accessToken),
        apiFetch(`/tasks/activity?taskId=${task.taskId}`, accessToken),
      ]);

      setComments(commentsRes || []);
      setActivity(activityRes || []);
    } catch (err) {
      console.error("Load task modal data failed", err);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  /* ---------------- ATTACHMENTS LOAD ---------------- */

  const loadAttachments = async () => {
    if (!task?.taskId) return;

    try {
      const data = await apiFetch(
        `/tasks/attachments?taskId=${task.taskId}`,
        accessToken,
      );
      setAttachments(data || []);
    } catch (err) {
      console.error("Load attachments failed", err);
    }
  };

  useEffect(() => {
    if (task?.taskId) loadAttachments();
  }, [task?.taskId]);

  /* ---------------- TITLE ---------------- */

  const saveTitle = async () => {
    if (!editTitle.trim() || editTitle === taskData.title) return;

    setSavingTitle(true);

    try {
      await apiFetch(`/tasks/${task.taskId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({
          taskId: task.taskId,
          projectId: task.projectId,
          title: editTitle,
        }),
      });
      toast.success("Title Updated");
      setTaskData((prev) => ({ ...prev, title: editTitle }));
    } catch (err) {
      console.error("Title update failed", err);
    }

    setSavingTitle(false);
  };

  /* ---------------- DESCRIPTION ---------------- */

  const saveDescription = async () => {
    try {
      await apiFetch(`/tasks/${task.taskId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({
          description,
          projectId: task.projectId,
        }),
      });
      toast.success("Description Updated");
      setTaskData((prev) => ({ ...prev, description }));
    } catch (err) {
      console.error("Description update failed", err);
    }
  };

  /* ---------------- PRIORITY ---------------- */

  const savePriority = async (newPriority) => {
    try {
      await apiFetch(`/tasks/${task.taskId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({
          priority: newPriority,
          projectId: task.projectId,
        }),
      });
      toast.success("Priority Updated");
      setPriority(newPriority);
    } catch {
      alert("Failed to update priority");
    }
  };

  /* ---------------- DUE DATE ---------------- */

  const saveDueDate = async (date) => {
    try {
      await apiFetch(`/tasks/${task.taskId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({
          dueDate: date,
          projectId: task.projectId,
        }),
      });
      toast.success("Due Date Updated");
      setDueDate(date);
    } catch {
      alert("Failed to update due date");
    }
  };

  /* ---------------- STATUS ---------------- */

  const updateStatus = async (newStatus) => {
    try {
      await apiFetch(`/tasks/${task.taskId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
          projectId: task.projectId,
        }),
      });

      setTaskData((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  /* ---------------- COMMENTS ---------------- */

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await apiFetch(`/tasks/comments`, accessToken, {
        method: "POST",
        body: JSON.stringify({
          taskId: task.taskId,
          message: commentText,
        }),
      });
      toast.success("Comment Posted");
      setCommentText("");
      loadTask();
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  /* ---------------- UPLOAD ---------------- */

  const handleUpload = async (file) => {
    if (!file || !task?.taskId) return;

    try {
      setUploading(true);

      const { uploadUrl } = await apiFetch(
        "/tasks/attachments/upload-url",
        accessToken,
        {
          method: "POST",
          body: JSON.stringify({
            taskId: task.taskId,
            fileName: file.name,
            contentType: file.type,
          }),
        },
      );

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      toast.success("Uploaded Successfully");
      await loadAttachments();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- PREVIEW ⭐ ---------------- */

  const previewAttachment = async (att) => {
    try {
      const { downloadUrl } = await apiFetch(
        `/tasks/attachments/download-url?attachmentId=${att.attachmentId}`,
        accessToken,
      );

      setPreviewUrl(downloadUrl);
      setPreviewFileName(att.fileName);
    } catch (err) {
      console.error("Preview failed", err);
    }
  };

  /* ---------------- DOWNLOAD ---------------- */

  const downloadAttachment = async (att) => {
    try {
      const { downloadUrl } = await apiFetch(
        `/tasks/attachments/download-url?attachmentId=${att.attachmentId}`,
        accessToken,
      );

      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteAttachment = async (att) => {
    try {
      await apiFetch("/tasks/attachments", accessToken, {
        method: "DELETE",
        body: JSON.stringify({
          attachmentId: att.attachmentId,
          taskId: task.taskId,
        }),
      });
      toast.success("Deleted Successfully");
      loadAttachments();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={saveTitle}
              className="text-xl font-semibold w-full outline-none"
            />

            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* STATUS */}
            <div>
              <div className="text-sm text-gray-800">Status</div>
              <select
                value={taskData.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="mt-1 px-3 py-2 rounded-lg border w-full"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div>
              <div className="text-sm text-gray-800 mb-1">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={saveDescription}
                rows={4}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>

            {/* PRIORITY */}
            <div>
              <div className="text-sm text-gray-800 mb-1">Priority</div>
              <select
                value={priority}
                onChange={(e) => savePriority(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* DUE DATE */}
            <div>
              <div className="text-sm text-gray-800 mb-1">Due Date</div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => saveDueDate(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>

            {/* COMMENTS */}
            <div>
              <div className="text-sm text-gray-800 mb-1">Comments</div>

              <div className="space-y-2 mb-2 max-h-40 overflow-y-auto">
                {comments.map((c) => (
                  <div
                    key={c.commentId}
                    className="border rounded-lg p-2 text-sm"
                  >
                    {c.message}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add comment"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button
                  onClick={addComment}
                  className="bg-black text-white px-4 rounded-lg transition
              hover:opacity-90 hover:shadow-md hover:-translate-y-[2px]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* ATTACHMENTS WITH PREVIEW */}
            <div className="space-y-3">
              <h3 className="text-sm text-gray-800 mb-1">Attachments</h3>

              <label className="flex items-center gap-3">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files[0])}
                />

                <div className="px-4 py-2 rounded-xl border cursor-pointer hover:bg-gray-50">
                  {uploading ? "Uploading..." : "Upload File"}
                </div>
              </label>

              <div className="space-y-2">
                {attachments.map((att) => {
                  const isImage = isImageFile(att.fileName);

                  return (
                    <div
                      key={att.attachmentId}
                      className="flex justify-between items-center border rounded-xl px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        {isImage ? (
                          <button onClick={() => previewAttachment(att)}>
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs">
                              IMG
                            </div>
                          </button>
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs">
                            FILE
                          </div>
                        )}

                        <span className="text-sm truncate max-w-[220px]">
                          {att.fileName}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {isImage && (
                          <button
                            onClick={() => previewAttachment(att)}
                            className="text-sm px-2 py-1 rounded text-white bg-black 
              hover:shadow-md hover:-translate-y-[2px]"
                          >
                            Preview
                          </button>
                        )}

                        <button
                          onClick={() => downloadAttachment(att)}
                          className="text-sm px-2 py-1 border rounded text-white bg-black transition
           hover:shadow-md hover:-translate-y-[2px]"
                        >
                          Download
                        </button>

                        <button
                          onClick={() => deleteAttachment(att)}
                          className="text-sm px-2 py-1 border rounded bg-red-500 text-white transition
          hover:shadow-md hover:-translate-y-[2px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTIVITY */}
            <div>
              <div className="font-semibold mb-2">Activity</div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activity.length === 0 && (
                  <div className="text-sm text-gray-400">No activity yet</div>
                )}

                {activity.map((a) => (
                  <div
                    key={a.activityId}
                    className="text-sm border-l-2 border-gray-200 pl-3 py-1"
                  >
                    <div>{a.message}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ IMAGE PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-ink dark:bg-black/70 flex items-center justify-center z-[60]">
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-8 right-0 text-white dark:text-white text-xl"
            >
              ✕
            </button>

            <img
              src={previewUrl}
              alt={previewFileName}
              className="max-h-[90vh] rounded-xl shadow-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
