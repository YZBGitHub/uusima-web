import React, { useState } from 'react';
import CustomCourseList, { CustomCourseData } from './CustomCourseList';
import TeacherCourseEditor from '../TeacherCourseManagement/TeacherCourseEditor';

interface CustomCourseManagementProps {
  onNavigateToCourseList?: () => void;
}

export default function CustomCourseManagement({ onNavigateToCourseList }: CustomCourseManagementProps) {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingCourse, setEditingCourse] = useState<CustomCourseData | null>(null);

  const handleEdit = (course: CustomCourseData) => {
    setEditingCourse(course);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingCourse(null);
  };

  const handleUpdateCourse = (updatedCourse: any) => {
    try {
      const stored = localStorage.getItem('uusima_custom_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        const nextList = parsed.map((item: any) =>
          item.id === updatedCourse.id ? { ...item, ...updatedCourse } : item
        );
        localStorage.setItem('uusima_custom_courses', JSON.stringify(nextList));
      }
    } catch (e) {
      console.error(e);
    }
    setEditingCourse(prev => (prev ? { ...prev, ...updatedCourse } : null));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {view === 'list' || !editingCourse ? (
        <CustomCourseList
          onEditCourse={handleEdit}
          onCloneSuccess={(clonedTitle) => {
            // 可选：提示是否跳转至系统课程列表
          }}
        />
      ) : (
        <TeacherCourseEditor
          course={editingCourse}
          onBack={handleBack}
          onUpdateCourse={handleUpdateCourse}
        />
      )}
    </div>
  );
}
