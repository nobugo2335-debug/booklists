// src/components/BookForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ★重要: Bookの型定義をexportします
export interface Book {
  id: number;
  タイトル: string;
  著者: string | null; // null許容に修正
  内容: string | null; // null許容に修正
  ステータス: '〇' | '貸出中'; 
  本棚番号: string; 
  作成日時?: string;
  更新日時?: string;
}

// Propsの型定義
interface BookFormProps {
  initialBook: Book | undefined; 
  setEditingBook: React.Dispatch<React.SetStateAction<Book | undefined>>;
  onSuccess: () => void; 
}

const API_URL = '/api/books';

export default function BookForm({ initialBook, setEditingBook, onSuccess }: BookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    タイトル: '',
    著者: '',
    内容: '',
    ステータス: '〇' as '〇' | '貸出中',
    本棚番号: '',
  });

  useEffect(() => {
    if (initialBook) {
      setFormState({
        タイトル: initialBook.タイトル,
        著者: initialBook.著者 || '', // nullの場合は空文字列
        内容: initialBook.内容 || '', // nullの場合は空文字列
        ステータス: initialBook.ステータス,
        本棚番号: initialBook.本棚番号,
      });
    } else {
      setFormState({
        タイトル: '',
        著者: '',
        内容: '',
        ステータス: '〇',
        本棚番号: '',
      });
    }
  }, [initialBook]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.タイトル.trim() || !formState.本棚番号.trim()) {
      alert('タイトルと本棚番号は必須項目です。');
      return;
    }

    setIsSubmitting(true);

    const isEditing = initialBook && initialBook.id;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${initialBook.id}` : API_URL;

    // APIに送るデータは、空文字列をnullに変換してPostgreSQLのDB定義に合わせる
    const dataToSend = {
      ...formState,
      著者: formState.著者.trim() || null, 
      内容: formState.内容.trim() || null,
      本棚番号: formState.本棚番号.trim(),
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend), 
      });

      if (res.status === 201 || res.status === 200) {
        
        if (!isEditing) {
            // 新規登録成功時はフォームをリセット
            setFormState({
                タイトル: '', 著者: '', 内容: '', ステータス: '〇', 本棚番号: '',
            });
        }
        
        if (isEditing) {
          // 編集成功時は編集モードを終了
          setEditingBook(undefined);
        }

        onSuccess(); // 親コンポーネント（BookList）に成功を通知し、リストを更新させる

      } else {
        const errorData = await res.json();
        throw new Error(`APIエラー: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      window.alert(`操作に失敗しました。\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = initialBook && initialBook.id;
  const buttonText = isEditing ? 'この本を更新' : '新しい本を登録';
  const titleText = isEditing ? `本の編集 (ID: ${initialBook.id})` : '新しい本を追加';

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl mb-8 border border-gray-100">
      <h2 className={`text-2xl font-bold mb-6 ${isEditing ? 'text-indigo-600' : 'text-gray-800'}`}>{titleText}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="タイトル" className="block text-sm font-medium text-gray-700">タイトル (必須)</label>
          <input type="text" id="タイトル" name="タイトル" value={formState.タイトル} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border" disabled={isSubmitting} />
        </div>

        <div>
          <label htmlFor="著者" className="block text-sm font-medium text-gray-700">著者</label>
          <input type="text" id="著者" name="著者" value={formState.著者} onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border" disabled={isSubmitting} />
        </div>

        <div>
          <label htmlFor="内容" className="block text-sm font-medium text-gray-700">内容 / 概要</label>
          <textarea id="内容" name="内容" value={formState.内容} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border" disabled={isSubmitting} ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label htmlFor="ステータス" className="block text-sm font-medium text-gray-700">ステータス</label>
            <select id="ステータス" name="ステータス" value={formState.ステータス} onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border bg-white" disabled={isSubmitting}>
              <option value="〇">〇</option>
              <option value="貸出中">貸出中</option>
            </select>
          </div>

          <div>
            <label htmlFor="本棚番号" className="block text-sm font-medium text-gray-700">本棚番号 (必須)</label>
            <input type="text" id="本棚番号" name="本棚番号" value={formState.本棚番号} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border" disabled={isSubmitting} />
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
          
          <button type="submit" className={`w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-white font-semibold transition duration-200 ${
              isEditing ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`} disabled={isSubmitting}>
            {isSubmitting ? '処理中...' : buttonText}
          </button>

          {isEditing && (
            <button type="button" onClick={() => setEditingBook(undefined)} className="ml-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isSubmitting}>
              キャンセル
            </button>
          )}

        </div>
      </form>
    </div>
  );
}