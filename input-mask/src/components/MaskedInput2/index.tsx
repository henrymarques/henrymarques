import React, {useRef, InputHTMLAttributes, useEffect} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  char?: string;
  accept?: string;
}

const MaskedInput: React.FC<InputProps> = ({
  mask,
  char,
  accept,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const back = useRef(false);

  const charSet = new Set<string>(char || "_");
  const prev = (j => Array.from(mask, (c, i) => charSet.has(c) ? j = i + 1 : j))(0);
  const first = Array.from(mask).findIndex(c => charSet.has(c));
  const validate = new RegExp(accept || "\\d", "g");

  // c -> char a ser substituido
  const clean = (input: string) => {
    const inputMatch = input.match(validate) || [];
    return Array.from(mask, c => {
      //inputMatch[0] === c || charSet.has(c) ? inputMatch.shift() || c : c
console.log(inputMatch[0], c);
      return inputMatch[0] === c || charSet.has(c) ? inputMatch.shift() || c : c
    }
    );
  }
  
  const format = () => {
    if(!inputRef.current) return;
    const [i, j] = [inputRef.current.selectionStart, inputRef.current.selectionEnd].map(i => {
      if(!inputRef.current) return 0;
      i = clean(inputRef.current.value.slice(0, i || 0)).findIndex(c => charSet.has(c));
      return i < 0 ? prev[prev.length - 1] : back.current ? prev[i-1] || first: i;
    });
    inputRef.current.value = clean(inputRef.current.value).join('');
    inputRef.current.setSelectionRange(i, j);
    back.current = false;
  };

  useEffect(() => {
    const el = inputRef.current;

    el?.addEventListener("keydown", (e) => back.current = e.key === "Backspace");
    el?.addEventListener("input", format);
    el?.addEventListener("blur", () => el?.value === mask && (el.value = ""));
    return () => {
      el?.removeEventListener("keydown", (e) => back.current = e.key === "Backspace");
      el?.removeEventListener("input", format);
      el?.removeEventListener("blur", () => el?.value === mask && (el.value = ""));
    }
  });
  return (
    <input ref={inputRef} {...rest}/>
  );
}

export default MaskedInput;
