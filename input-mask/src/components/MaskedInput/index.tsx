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
  const pattern = mask.split('');
  const regexp = new RegExp(accept || "\\d", "g");

  function stripMask(maskedData: string) {
    return maskedData.split('').filter(input => !regexp.test(input));
  }

  function applyMask(data: Array<string>) {
    return pattern.map(input => {
      if(input !== char) return char;
      if(data.length === 0) return char;
      return data.shift();
    }).join('');
  }

  function reapplyMask(data: string) {
    return applyMask(stripMask(data));
  }

  function changed() {
    const el = inputRef.current;
    if(el) {
      const oldStart = el.selectionStart;
      const oldEnd = el.selectionEnd;

      el.value = reapplyMask(el.value);
      el.selectionStart = oldStart;
      el.selectionEnd = oldEnd;
    }
  }

  useEffect(() => {
    const el = inputRef.current;

    el?.addEventListener("keyup", changed);
    el?.addEventListener("focus", changed);
    return () => {
      el?.removeEventListener("keyup", changed);
      el?.removeEventListener("focus", changed);
    }
  });
  return (
    <input ref={inputRef} {...rest}/>
  );
}

export default MaskedInput;
