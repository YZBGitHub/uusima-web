import React, { useEffect, useRef, useState } from 'react';
import { Bot, Check, ChevronDown, X } from 'lucide-react';

export interface SelectOption {
  id: string;
  name: string;
  description?: string;
  category?: string;
  type?: string;
  icon?: typeof Bot;
}

export default function SearchableSingleSelect({ id, value, options, placeholder, savedLabel, onChange }: {
  id: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  savedLabel: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // 保留旧版手工填写的 ID，避免已有配置在切换控件后丢失。
  const choices: SelectOption[] = value && !options.some(option => option.id === value)
    ? [{ id: value, name: savedLabel }, ...options]
    : options;
  const selected = choices.find(option => option.id === value);
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = choices.filter(option => [option.name, option.id, option.description, option.category, option.type].filter(Boolean).join(' ').toLocaleLowerCase().includes(keyword));
  const activeOption = filtered[activeIndex];

  useEffect(() => {
    const list = listRef.current;
    const option = list?.children[activeIndex] as HTMLElement | undefined;
    if (!open || !list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [open, activeIndex, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  };

  const select = (option: SelectOption) => {
    onChange(option.id);
    close();
  };

  return (
    <div
      className="relative w-[300px] max-w-full"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      <div className={`flex h-8 items-center rounded border bg-white transition-colors focus-within:border-[#409eff] ${open ? 'border-[#409eff]' : 'border-[#dcdfe6] hover:border-[#c0c4cc]'}`}>
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-activedescendant={open && activeOption ? `${id}-option-${activeIndex}` : undefined}
          autoComplete="off"
          value={open ? query : selected?.name || ''}
          placeholder={open && selected ? selected.name : placeholder}
          title={selected ? `${selected.name}（${selected.id}）` : undefined}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={event => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setOpen(true);
              setActiveIndex(index => {
                const next = !open ? 0 : index + (event.key === 'ArrowDown' ? 1 : -1);
                return filtered.length ? (next + filtered.length) % filtered.length : 0;
              });
            } else if (event.key === 'Enter') {
              event.preventDefault();
              if (open && activeOption) select(activeOption);
              else setOpen(true);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              close();
            }
          }}
          className="h-full min-w-0 flex-1 truncate bg-transparent px-2.5 text-sm text-[#606266] outline-none placeholder:text-[#a8abb2]"
        />
        {value && (
          <button
            type="button"
            aria-label={`清空${savedLabel.replace('已保存的', '')}`}
            onMouseDown={event => event.preventDefault()}
            onClick={() => {
              onChange('');
              setQuery('');
              setActiveIndex(0);
              inputRef.current?.focus();
            }}
            className="cursor-pointer p-1 text-[#a8abb2] hover:text-[#606266]"
          ><X className="h-3.5 w-3.5" /></button>
        )}
        <button
          type="button"
          aria-label={open ? '收起选项' : '展开选项'}
          aria-expanded={open}
          aria-controls={`${id}-options`}
          onMouseDown={event => event.preventDefault()}
          onClick={() => {
            inputRef.current?.focus();
            if (open) close();
            else setOpen(true);
          }}
          className="h-full cursor-pointer px-2 text-[#a8abb2]"
        ><ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} /></button>
      </div>
      {open && (
        <div ref={listRef} id={`${id}-options`} role="listbox" aria-label={`${savedLabel.replace('已保存的', '')}选项`} className="absolute top-full z-30 mt-1 w-[440px] max-w-[calc(100vw-2rem)] max-h-80 overflow-y-auto rounded border border-[#e4e7ed] bg-white py-1.5 shadow-lg">
          {filtered.length ? filtered.map((option, index) => (
            <button
              key={option.id}
              id={`${id}-option-${index}`}
              type="button"
              role="option"
              aria-selected={option.id === value}
              tabIndex={-1}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(option)}
              className={`flex w-full cursor-pointer items-start gap-3 px-3 py-3 text-left text-sm ${index === activeIndex ? 'bg-[#f5f7fa]' : ''} ${option.id === value ? 'text-[#409eff]' : 'text-[#606266]'}`}
            >
              {option.icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ecf5ff] text-[#409eff]" aria-hidden="true">
                  <option.icon className="h-5 w-5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block break-words font-medium leading-5">{option.name}</span>
                {option.type && <span className="mt-1 inline-block rounded bg-[#ecf5ff] px-1.5 py-0.5 text-xs text-[#409eff]">类型：{option.type}</span>}
                {option.description && <span className="mt-1 block break-words text-xs leading-5 text-[#909399]">{option.description}</span>}
                {option.category && <span className="mt-1 inline-block rounded bg-[#f0f2f5] px-1.5 py-0.5 text-xs text-[#606266]">分类：{option.category}</span>}
                {!option.description && <span className="mt-0.5 block break-all text-xs text-[#909399]">{option.id}</span>}
              </span>
              {option.id === value && <Check className="h-4 w-4 shrink-0" />}
            </button>
          )) : <div role="status" className="px-3 py-4 text-center text-sm text-[#909399]">无匹配结果</div>}
        </div>
      )}
    </div>
  );
}
