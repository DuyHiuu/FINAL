import React, { useState } from 'react';

interface EditCommentProps {
    comment: {
        id: number;
        content: string;
    };
    onEditComment: (id: number, content: string) => void;
    onCancel: () => void;
}

const EditComment: React.FC<EditCommentProps> = ({ comment, onEditComment, onCancel }) => {
    const [updatedComment, setUpdatedComment] = useState<string>(comment.content);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (updatedComment.trim()) {
            onEditComment(comment.id, updatedComment);
            onCancel(); // Close edit mode after editing
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                rows={3}
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
                className="border w-full p-2 rounded"
                required
            />
            <div className="mt-2">
                <button
                    type="submit"
                    className="text-white px-4 py-2 rounded bg-[#064749]"
                >
                    Cập nhật
                </button>
                <button
                    type="button"
                    className="ml-2 text-gray-500 border border-gray-300 rounded px-4 py-2"
                    onClick={onCancel}
                >
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default EditComment;
