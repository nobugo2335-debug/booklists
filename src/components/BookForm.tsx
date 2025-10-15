'use client';

import React, { useState, useEffect } from 'react';

// データの型定義 (Prismaモデルに合わせる)
interface Book {
  id?: string;
  shelfNo: string;
  title: string;
  author: string;
  description: string;
  status: 'available' | 'on_loan';
}

interface BookFormProps {
  initialBook?: Book;
  onSave: (book: Book) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ initialBook, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState<Book>({
    shelfNo: '',
    title: '',
    author: '',
    description: '',
    status: 'available',
    ...(initialBook || {})
  });

  // initialBookが更新されたときにフォームをリセット
  useEffect(() => {
    setFormData({
      shelfNo: '',
      title: '',
      author: '',
      description: '',
      status: 'available',
      ...(initialBook || {})
    });
  }, [initialBook]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shelfNo || !formData.title) {
        // alert()の代わりにカスタムメッセージを使用
        console.error('Validation Error: Shelf Number and Title are required');
        return;
    }
    onSave(formData);
  };

  const isEditMode = !!initialBook?.id;

  return (
    <div className="p-4 bg-white shadow-xl rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{isEditMode ? '本を編集' : '本を新規登録'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 本棚NO */}
        <div>
          <label htmlFor="shelfNo" className="block text-sm font-medium text-gray-700">本棚NO <span className="text-red-500">*</span></label>
          <input
            id="shelfNo"
            name="shelfNo"
            type="text"
            value={formData.shelfNo}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">タイトル <span className="text-red-500">*</span></label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 著者 */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">著者</label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 内容 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">内容</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* ステータス */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">ステータス</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="available">〇 (利用可能)</option>
            <option value="on_loan">貸出中</option>
          </select>
        </div>

        {/* ボタン群 */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition duration-150"
            disabled={isSaving}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? (isEditMode ? '更新中...' : '登録中...') : (isEditMode ? '更新' : '登録')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
