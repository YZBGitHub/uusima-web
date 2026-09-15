import React, { useState } from 'react';
import CourseList from './CourseList';
import CourseEditor from './CourseEditor';

export default function CourseManagement() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editCourseId, setEditCourseId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditCourseId(id);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditCourseId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {view === 'list' ? (
        <CourseList onEditCourse={handleEdit} />
      ) : (
        <CourseEditor courseId={editCourseId!} onBack={handleBack} />
      )}
    </div>
  );
}
