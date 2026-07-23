import React, { useState, useEffect } from "react";
import { User, Edit, IdCard, Shield } from "lucide-react";

export default function PersonalInfo({ profileData, setProfileData, setIsEditingProfile, isEditingProfile, setConfirmConfig, setIsOrgRecordsModalOpen, setOrgToExit, setExitOrgCountdown, setExitOrgModalOpen, onNavigate }: any) {
  return (
    <div className="p-8 flex flex-col space-y-6 relative">
                {/* 主信息区 */}
                <div className="flex items-center justify-between absolute right-8 top-8 z-0">
                  <div />
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      编辑
                    </button>
                  )}
                </div>

                <div className="flex flex-row pt-8">
                  <div className="flex-1 max-w-xl">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        账号：
                      </label>
                      <div className="text-slate-900 text-sm py-1">
                        {profileData.account}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        {isEditingProfile && (
                          <span className="text-red-500 font-bold mr-1">*</span>
                        )}
                        用户名：
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          value={profileData.userName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              userName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-slate-900 text-sm py-1">
                          {profileData.userName}
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        手机号：
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-500 bg-slate-50 focus:outline-none focus:ring-0"
                          readOnly
                          value={profileData.phone}
                        />
                      ) : (
                        <div className="text-slate-900 text-sm py-1">
                          {profileData.phone}
                        </div>
                      )}
                    </div>
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-slate-500 mb-2">
                        {isEditingProfile && (
                          <span className="text-red-500 font-bold mr-1">*</span>
                        )}
                        性别：
                      </label>
                      {isEditingProfile ? (
                        <div className="flex items-center space-x-6 h-10">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={profileData.gender === "female"}
                              onChange={() =>
                                setProfileData({
                                  ...profileData,
                                  gender: "female",
                                })
                              }
                              className="w-4 h-4 text-blue-500 bg-slate-50 border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="ml-2 text-sm text-slate-700 group-hover:text-slate-900">
                              女
                            </span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={profileData.gender === "male"}
                              onChange={() =>
                                setProfileData({
                                  ...profileData,
                                  gender: "male",
                                })
                              }
                              className="w-4 h-4 text-blue-500 bg-slate-50 border-slate-300 focus:ring-blue-500 focus:ring-offset-0"
                            />
                            <span className="ml-2 text-sm text-slate-700 group-hover:text-slate-900">
                              男
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="text-slate-900 text-sm py-1">
                          {profileData.gender === "female" ? "女" : "男"}
                        </div>
                      )}
                    </div>

                    {isEditingProfile && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setIsEditingProfile(false)}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={() =>
                            setConfirmConfig({
                              isOpen: true,
                              title: "确认保存",
                              content: "确定要保存修改后的个人信息吗？",
                              onConfirm: () => {
                                setIsEditingProfile(false);
                              },
                            })
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                          保存
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="w-64 pl-16">
                    <label className="block text-sm font-medium text-slate-500 mb-4">
                      头像
                    </label>
                    <div className="w-24 h-24 border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      {isEditingProfile ? (
                        <span className="text-slate-400 text-3xl font-light leading-none mb-1">
                          +
                        </span>
                      ) : (
                        <User className="text-slate-400 w-12 h-12" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 补充信息：认证与组织 */}
                <div className="mt-8 border-t border-slate-100 flex flex-col md:flex-row gap-8 pt-8">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-bold text-slate-800 flex items-center">
                        <IdCard className="w-5 h-5 mr-2 text-blue-500" />
                        身份认证信息
                      </h3>
                      <button
                        onClick={() =>
                          setProfileData((prev) => ({
                            ...prev,
                            isCertified: !prev.isCertified,
                          }))
                        }
                        className="px-2 py-1 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors border border-blue-200"
                      >
                        切换状态（演示用）
                      </button>
                    </div>
                    {profileData.isCertified ? (
                      <div className="space-y-4">
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">姓名：</span>
                          <span className="text-slate-900 font-medium">
                            张三
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">
                            认证类型：
                          </span>
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                            教师认证
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">
                            所属学校：
                          </span>
                          <span className="text-slate-900 font-medium">
                            某某大学
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 w-24">
                            工号/学号：
                          </span>
                          <span
                            className="text-slate-900 font-medium cursor-pointer"
                            title="点击查看详情"
                          >
                            20010******
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 bg-white border border-slate-200 border-dashed rounded-lg shadow-sm">
                        <Shield className="w-10 h-10 text-slate-200 mb-3" />
                        <div className="text-slate-500 text-sm mb-4">
                          暂未完成身份认证
                        </div>
                        <button
                          onClick={() => onNavigate("certification")}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          去认证
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-bold text-slate-800 flex items-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5 mr-2 text-indigo-500"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        加入的组织
                      </h3>
                      <button
                        onClick={() => setIsOrgRecordsModalOpen(true)}
                        className="text-[#1890ff] text-sm hover:text-blue-700 font-medium transition-colors"
                      >
                        邀请记录
                      </button>
                    </div>
                    {profileData.organizations &&
                    profileData.organizations.length > 0 ? (
                      <div className="space-y-3">
                        {profileData.organizations.map(
                          (org: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mr-4 shrink-0 border border-indigo-100">
                                {org.name.charAt(0)}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-medium text-slate-900 truncate mb-0.5">
                                  {org.name}
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                  {org.status === "pending" ? (
                                    <>
                                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
                                      <span className="text-amber-600 mr-2 font-medium">
                                        审核中
                                      </span>
                                    </>
                                  ) : (
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                                  )}
                                  {org.role}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 text-xs px-3 py-1.5 hover:bg-blue-50 rounded font-medium transition-colors">
                                  详情
                                </button>
                                <button
                                  onClick={() => {
                                    setOrgToExit(org.name);
                                    setExitOrgCountdown(10);
                                    setExitOrgModalOpen(true);
                                  }}
                                  className="text-red-500 text-xs px-3 py-1.5 hover:bg-red-50 rounded font-medium transition-colors"
                                >
                                  退出
                                </button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 bg-white border border-slate-200 border-dashed rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-6 h-6 text-slate-300"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="text-slate-400 text-sm">
                          暂未加入其他组织
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
  );
}
