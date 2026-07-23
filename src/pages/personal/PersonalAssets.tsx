import React, { useState } from "react";
import { Search, ChevronDown, Package, Gift, RefreshCw, ChevronLeft, ChevronRight, Calendar, Gem, Activity, Clock, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

export default function PersonalAssets({ 
  usageSearchMonth, setUsageSearchMonth, last6Months, 
  usageItemSearch, setUsageItemSearch, 
  usageTypeFilter, setUsageTypeFilter, 
  getFilteredAndSortedRecords,
  setIsPointsRecordModalOpen,
  isCalendarOpen, setIsCalendarOpen, calendarDate, setCalendarDate, signedInDates, handleSignClick, isSignToastOpen
}: any) {
  return (
    <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-slate-800">
                      我的资源
                    </h1>
                    {"personal" === "personal" && (
                      <div className="ml-4 flex items-center space-x-3">
                        <div className="group relative px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-100 flex items-center cursor-help">
                          <Gem className="w-4 h-4 mr-1.5" />
                          当前积分:{" "}
                          <span className="font-bold ml-1">12,500</span>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1.5 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            约等于 12,500 个 Token
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsPointsRecordModalOpen(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                        >
                          积分消耗记录
                        </button>
                      </div>
                    )}
                  </div>
                  {"personal" === "personal" && (
                    <div className="flex items-center space-x-3">
                      <button
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm group relative"
                        onClick={handleSignClick}
                      >
                        <Gift className="w-4 h-4 mr-1.5" />
                        签到送积分
                        <div className="absolute right-0 top-full mt-2 w-64 px-3 py-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 font-normal truncate">
                          每日登录签到可领取 100 积分奖励
                        </div>
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                          className={`p-2 rounded-lg transition-colors border ${isCalendarOpen ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {isCalendarOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl p-5 z-20"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-medium text-slate-800">
                                  2026年 6月
                                </span>
                                <button className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-50">
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
                                <div>日</div>
                                <div>一</div>
                                <div>二</div>
                                <div>三</div>
                                <div>四</div>
                                <div>五</div>
                                <div>六</div>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                <div className="aspect-square flex items-center justify-center rounded-md text-slate-300">
                                  31
                                </div>
                                {Array.from({ length: 30 }).map((_, i) => {
                                  const dayInfo = i + 1;
                                  const dateStr = `2026-06-${dayInfo.toString().padStart(2, "0")}`;
                                  const isSigned =
                                    signedInDates.includes(dateStr);
                                  const isToday = dayInfo === 11;
                                  return (
                                    <div
                                      key={i}
                                      className={`aspect-square flex flex-col items-center justify-center rounded-md relative ${isSigned ? "bg-orange-50 text-orange-600 font-medium border border-orange-100" : isToday ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                      {isSigned && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                      )}
                                      <span>{dayInfo}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center space-x-4 text-xs text-slate-500">
                                <div className="flex items-center">
                                  <div className="w-2.5 h-2.5 bg-orange-400 rounded-full mr-1.5"></div>
                                  已签到
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2.5 h-2.5 bg-blue-100 border border-blue-200 rounded-full mr-1.5"></div>
                                  今日
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>

                {"personal" === "personal" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* 算力配额 */}
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                      <div className="p-6 flex items-center">
                        <div className="flex-1">
                          <div className="flex flex-row items-center space-x-2 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-500">
                              Token (词元) 数量
                            </h3>
                            <Activity className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex items-baseline space-x-2 mt-2">
                            <div className="text-3xl font-bold text-slate-800">
                              860,666
                            </div>
                            <span className="text-sm font-bold text-slate-600">
                              剩余
                            </span>
                          </div>
                          <div className="text-xs mt-4 space-y-1">
                            <div className="text-slate-500">
                              总计: 1,000,000
                            </div>
                            <div className="text-slate-500 flex items-center gap-1">
                              已使用:{" "}
                              <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                              139,334
                            </div>
                          </div>
                        </div>
                        <div className="w-32 h-32 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "剩余", value: 860666 },
                                  { name: "已使用", value: 139334 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell key="cell-0" fill="#3b82f6" />
                                <Cell key="cell-1" fill="#cbd5e1" />
                              </Pie>
                              <RechartsTooltip
                                formatter={(value: number) =>
                                  value.toLocaleString()
                                }
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                            <span className="text-xs text-blue-600 font-bold">
                              86%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 实验时长 */}
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                      <div className="p-6 flex items-center">
                        <div className="flex-1">
                          <div className="flex flex-row items-center space-x-2 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-500">
                              实验时长
                            </h3>
                            <Clock className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="flex items-baseline space-x-2 mt-2">
                            <div className="text-3xl font-bold text-slate-800">
                              1,200
                            </div>
                            <span className="text-sm font-bold text-slate-600">
                              分钟 剩余
                            </span>
                          </div>
                          <div className="text-xs mt-4 space-y-1">
                            <div className="text-slate-500">总计: 2,000 分钟</div>
                            <div className="text-slate-500 flex items-center gap-1">
                              已使用:{" "}
                              <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                              800 分钟
                            </div>
                          </div>
                        </div>
                        <div className="w-32 h-32 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "剩余", value: 1200 },
                                  { name: "已使用", value: 800 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell key="cell-0" fill="#10b981" />
                                <Cell key="cell-1" fill="#cbd5e1" />
                              </Pie>
                              <RechartsTooltip
                                formatter={(value: number) => value + " 分钟"}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                            <span className="text-xs text-emerald-600 font-bold">
                              60%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PPT 次数 */}
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                      <div className="p-6 flex items-center">
                        <div className="flex-1">
                          <div className="flex flex-row items-center space-x-2 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-500">
                              PPT 生成次数
                            </h3>
                            <FileText className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="flex items-baseline space-x-2 mt-2">
                            <div className="text-3xl font-bold text-slate-800">
                              80
                            </div>
                            <span className="text-sm font-bold text-slate-600">
                              次 剩余
                            </span>
                          </div>
                          <div className="text-xs mt-4 space-y-1">
                            <div className="text-slate-500">总计: 200 次</div>
                            <div className="text-slate-500 flex items-center gap-1">
                              已使用:{" "}
                              <span className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-sm inline-block"></span>{" "}
                              120 次
                            </div>
                          </div>
                        </div>
                        <div className="w-32 h-32 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "剩余", value: 80 },
                                  { name: "已使用", value: 120 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell key="cell-0" fill="#a855f7" />
                                <Cell key="cell-1" fill="#cbd5e1" />
                              </Pie>
                              <RechartsTooltip
                                formatter={(value: number) => value + " 次"}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0.5">
                            <span className="text-xs text-purple-600 font-bold">
                              40%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="col-span-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      使用记录
                    </h3>
                    <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-3 items-center">
                        <div className="relative">
                          <select
                            value={usageSearchMonth}
                            onChange={(e) =>
                              setUsageSearchMonth(e.target.value)
                            }
                            className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 appearance-none"
                          >
                            {last6Months.map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="按计费项搜索"
                            value={usageItemSearch}
                            onChange={(e) => setUsageItemSearch(e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                          />
                        </div>
                        <div className="flex items-center space-x-1 ml-2 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
                          {(["token", "duration", "ppt"] as const).map(
                            (type) => (
                              <label
                                key={type}
                                className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${usageTypeFilter === type ? "bg-white shadow-sm text-blue-600 font-medium" : "text-slate-600 hover:text-slate-800"}`}
                              >
                                <input
                                  type="radio"
                                  name="usageType"
                                  value={type}
                                  checked={usageTypeFilter === type}
                                  onChange={(e) =>
                                    setUsageTypeFilter(e.target.value as any)
                                  }
                                  className="hidden"
                                />
                                {type === "token"
                                  ? "Token"
                                  : type === "duration"
                                    ? "时长"
                                    : "PPT"}
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 font-medium">序号</th>
                              <th className="px-6 py-4 font-medium">
                                开始时间
                              </th>
                              <th className="px-6 py-4 font-medium">
                                使用账号
                              </th>
                              <th className="px-6 py-4 font-medium">
                                计费项（环境）
                              </th>
                              <th className="px-6 py-4 font-medium">用量</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {getFilteredAndSortedRecords().map((record) => (
                              <tr
                                key={record.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-6 py-4 text-slate-600">
                                  {record.id}
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                  {record.startTime}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                  {record.account}
                                </td>
                                <td className="px-6 py-4 text-slate-800 break-words">
                                  {record.item}
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                  {record.type === "token" ? (
                                    <span className="text-blue-600 font-medium">
                                      {record.amount.toLocaleString()} Token(s)
                                    </span>
                                  ) : record.type === "duration" ? (
                                    <span className="text-emerald-600 font-medium">
                                      {record.amount} 分钟
                                    </span>
                                  ) : (
                                    <span className="text-purple-600 font-medium">
                                      {record.amount} 次
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {getFilteredAndSortedRecords().length === 0 && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-6 py-8 text-center text-slate-400"
                                >
                                  没有找到匹配的记录
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  );
}
