import React from "react";
import { Check, XCircle, ChevronDown, ChevronUp, Bell, FileText, CheckCircle2, Gem, Clock, Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalMessages({ 
  activeMessageTab, setActiveMessageTab, 
  todoCategory, setTodoCategory,
  selectedTodos, toggleSelectAllTodos, toggleTodoSelection, filteredTodos,
  expandedTodo, setExpandedTodo,
  setRejectModalOpen,
  setConfirmConfig,
  invites, notifications, adminApprovalFilter, setAdminApprovalFilter,
  adminApprovals, adminApprovalDetailModal, setAdminApprovalDetailModal,
  isRejectingEntity, setIsRejectingEntity, rejectReason, setRejectReason
}: any) {
  return (
    <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                  <div className="mb-6">
                    <div className="flex items-end justify-between mb-2">
                      <h1 className="text-2xl font-bold text-slate-800">
                        消息通知
                      </h1>
                    </div>
                    <div className="flex space-x-2 border-b border-slate-200 mt-4">
                      <button
                        onClick={() => setActiveMessageTab("todo")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center -mb-[1px] ${
                          activeMessageTab === "todo"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        待办事项 (待审批)
                        <span className="ml-1.5 min-w-[1.25rem] text-center text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
                          12
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveMessageTab("system")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                          activeMessageTab === "system"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        系统通知
                      </button>
                      <button
                        onClick={() => setActiveMessageTab("audit")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-[1px] flex items-center space-x-1.5 ${
                          activeMessageTab === "audit"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>身份认证审核</span>
                        {adminApprovals.filter((a) => a.status === "pending")
                          .length > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {
                              adminApprovals.filter(
                                (a) => a.status === "pending",
                              ).length
                            }
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 内容区域 */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {activeMessageTab === "todo" && (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setTodoCategory("pending");
                                /* setSelectedTodos */ ([]);
                                setExpandedTodo(null);
                              }}
                              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${todoCategory === "pending" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-200"}`}
                            >
                              待审批
                            </button>
                            <button
                              onClick={() => {
                                setTodoCategory("approved");
                                /* setSelectedTodos */ ([]);
                                setExpandedTodo(null);
                              }}
                              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${todoCategory === "approved" ? "bg-green-100 text-green-700" : "text-slate-600 hover:bg-slate-200"}`}
                            >
                              已通过
                            </button>
                            <button
                              onClick={() => {
                                setTodoCategory("rejected");
                                /* setSelectedTodos */ ([]);
                                setExpandedTodo(null);
                              }}
                              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${todoCategory === "rejected" ? "bg-red-100 text-red-700" : "text-slate-600 hover:bg-slate-200"}`}
                            >
                              已驳回
                            </button>
                          </div>
                          {todoCategory === "pending" && (
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                  checked={
                                    selectedTodos.length ===
                                      filteredTodos.length &&
                                    filteredTodos.length > 0
                                  }
                                  onChange={toggleSelectAllTodos}
                                />
                                <span className="text-sm font-medium text-slate-700">
                                  全选
                                </span>
                              </label>
                              <span className="text-sm text-slate-500">
                                已选 {selectedTodos.length} 项
                              </span>
                              <button
                                disabled={selectedTodos.length === 0}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded disabled:bg-blue-300 transition-colors"
                              >
                                批量通过
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="divide-y divide-slate-100">
                          {filteredTodos.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                              暂无数据
                            </div>
                          ) : (
                            filteredTodos.map((todo) => (
                              <div
                                key={todo.id}
                                className="flex flex-col transition-colors hover:bg-slate-50/50"
                              >
                                <div
                                  className="flex items-center p-5 cursor-pointer"
                                  onClick={() =>
                                    setExpandedTodo(
                                      expandedTodo === todo.id ? null : todo.id,
                                    )
                                  }
                                >
                                  {todoCategory === "pending" && (
                                    <div
                                      className="mr-4"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedTodos.includes(
                                          todo.id,
                                        )}
                                        onChange={() =>
                                          toggleTodoSelection(todo.id)
                                        }
                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 mr-4">
                                      {todo.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-slate-900 truncate">
                                          {todo.name}
                                        </span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded truncate max-w-[120px]">
                                          {todo.role}
                                        </span>
                                        {todoCategory === "pending" && (
                                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded border border-amber-200">
                                            待审批
                                          </span>
                                        )}
                                        {todoCategory === "approved" && (
                                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded border border-green-200">
                                            已通过
                                          </span>
                                        )}
                                        {todoCategory === "rejected" && (
                                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                                            已驳回
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-500 mt-1 truncate">
                                        申请角色：{todo.role} | 部门：
                                        {todo.dept} | 类型：{todo.type}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className="flex items-center space-x-3 ml-4"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {todoCategory === "pending" && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setRejectReason("");
                                            setRejectModalOpen(true);
                                          }}
                                          className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-colors shadow-sm"
                                        >
                                          驳 回
                                        </button>
                                        <button
                                          onClick={() =>
                                            setConfirmConfig({
                                              isOpen: true,
                                              title: "确认通过",
                                              content:
                                                "确定要通过该认证申请吗？",
                                              onConfirm: () => {},
                                            })
                                          }
                                          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm transition-colors"
                                        >
                                          通 过
                                        </button>
                                      </>
                                    )}
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                      <ChevronDown
                                        className={`w-5 h-5 transition-transform ${expandedTodo === todo.id ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedTodo === todo.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-slate-50 border-t border-slate-100"
                                    >
                                      <div className="p-6">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-4">
                                          表单详情
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                          {todo.details.map((detail, idx) => (
                                            <div
                                              key={idx}
                                              className="flex flex-col space-y-1"
                                            >
                                              <span className="text-xs font-medium text-slate-500">
                                                {detail.label}
                                              </span>
                                              <span className="text-sm text-slate-900">
                                                {detail.value}
                                              </span>
                                            </div>
                                          ))}
                                          {todo.status === "rejected" &&
                                            todo.rejectReason && (
                                              <div className="flex flex-col space-y-1 sm:col-span-2">
                                                <span className="text-xs font-medium text-red-500">
                                                  驳回原因
                                                </span>
                                                <span className="text-sm text-slate-900 bg-red-50 p-2 rounded border border-red-100">
                                                  {todo.rejectReason}
                                                </span>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {activeMessageTab === "system" && (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((note) => (
                          <div
                            key={note.id}
                            className="flex items-center p-5 hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="shrink-0 mr-4">
                              {note.type === "success" && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              )}
                              {note.type === "reject" && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              {note.type === "asset" && (
                                <Gem className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <p className="text-[15px] text-slate-700">
                              {note.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeMessageTab === "audit" && (
                      <div className="divide-y divide-slate-100">
                        <div className="p-4 bg-slate-50 flex items-center space-x-2 border-b border-slate-100">
                          <button
                            onClick={() => setAdminApprovalFilter("school")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${adminApprovalFilter === "school" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-200"}`}
                          >
                            院校认证
                          </button>
                          <button
                            onClick={() => setAdminApprovalFilter("enterprise")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${adminApprovalFilter === "enterprise" ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-200"}`}
                          >
                            企业认证
                          </button>
                        </div>
                        {adminApprovals
                          .filter((a) => a.type === adminApprovalFilter)
                          .map((approval) => (
                            <div
                              key={`approval-${approval.id}`}
                              className="flex flex-col p-5 hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-medium ${approval.type === "school" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
                                    >
                                      {approval.type === "school"
                                        ? "院校认证"
                                        : "企业认证"}
                                    </span>
                                    <h3 className="font-bold text-slate-800">
                                      {approval.organization}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    申请人：{approval.name}{" "}
                                    <span className="mx-2 text-slate-300">
                                      |
                                    </span>{" "}
                                    申请身份：{approval.role}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-2 flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    提交时间：{approval.applyTime}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  {approval.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        setAdminApprovalDetailModal(approval)
                                      }
                                      className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                                    >
                                      审 核
                                    </button>
                                  )}
                                  {approval.status === "approved" && (
                                    <span className="text-sm font-medium text-green-600 flex items-center px-3 py-1.5 bg-green-50 rounded-md border border-green-100">
                                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                      已通过
                                    </span>
                                  )}
                                  {approval.status === "rejected" && (
                                    <span
                                      className="text-sm font-medium text-red-600 flex items-center px-3 py-1.5 bg-red-50 rounded-md border border-red-100"
                                      title={approval.rejectReason}
                                    >
                                      <XCircle className="w-4 h-4 mr-1.5" />
                                      已驳回
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        {adminApprovals.filter(
                          (a) => a.type === adminApprovalFilter,
                        ).length === 0 && (
                          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                            <Shield className="w-12 h-12 mb-3 text-slate-200" />
                            <p>暂无待审核的认证信息</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 驳回原因填写弹窗 (Modal) */}
                  <AnimatePresence>
                    {false && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setRejectModalOpen(false)}
                          className="fixed inset-0 bg-black/50 z-[100]"
                        />
                        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 300,
                            }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-[480px] overflow-hidden pointer-events-auto"
                          >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                              <h2 className="text-lg font-semibold text-slate-900">
                                填写驳回原因
                              </h2>
                              <button
                                onClick={() => setRejectModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-6">
                              <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2">
                                <span>
                                  驳回原因{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                                <span
                                  className={`text-xs ${rejectReason.length < 50 || rejectReason.length > 200 ? "text-red-500" : "text-slate-500"}`}
                                >
                                  {rejectReason.length} / 200 (需50-200字)
                                </span>
                              </label>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <button
                                  onClick={() =>
                                    setRejectReason(
                                      "您提交的申请信息不完整，缺少平台规定的必要证明材料。请您仔细核对身份认证要求，补充所需的详细信息及证明文件后再次提交审核。",
                                    )
                                  }
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors border border-slate-200"
                                >
                                  信息不完整
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectReason(
                                      "系统检测到您的工号/学号验证失败，可能是由于输入有误或对应机构在库名单中未包含该信息。请确认正确的学工号后重新发起申请。",
                                    )
                                  }
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors border border-slate-200"
                                >
                                  学工号验证失败
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectReason(
                                      "由于您非本机构（学校/企业）的正式注册人员，暂不符合此身份角色的认证要求。如有特殊情况，请联系机构管理人员确认后重新申请。",
                                    )
                                  }
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded transition-colors border border-slate-200"
                                >
                                  非本机构人员
                                </button>
                              </div>
                              <textarea
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                className={`w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] resize-y ${(rejectReason.length > 0 && rejectReason.length < 50) || rejectReason.length > 200 ? "border-red-300" : "border-slate-300"}`}
                                placeholder="请输入驳回原因，此内容将反馈给申请人"
                                maxLength={200}
                                required
                              />
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                              <button
                                onClick={() => setRejectModalOpen(false)}
                                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                取消
                              </button>
                              <button
                                disabled={
                                  rejectReason.length < 50 ||
                                  rejectReason.length > 200
                                }
                                onClick={() => {
                                  setRejectModalOpen(false);
                                  setRejectReason("");
                                }}
                                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:bg-red-300 disabled:cursor-not-allowed"
                              >
                                确认驳回
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
  );
}
