import React, { useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange, error }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return; // Only numeric

    const newArr = [...value];
    newArr[index] = val.substring(val.length - 1); // Take only the last character
    onChange(newArr);

    // Auto-advance
    if (val !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (value[index] === '' && index > 0) {
        // Focus previous
        inputRefs.current[index - 1]?.focus();
        const newArr = [...value];
        newArr[index - 1] = '';
        onChange(newArr);
      } else {
        const newArr = [...value];
        newArr[index] = '';
        onChange(newArr);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    if (!pasteData) return;
    
    const newArr = [...value];
    for (let i = 0; i < length; i++) {
      newArr[i] = pasteData[i] || '';
    }
    onChange(newArr);

    // Focus next empty or last
    const nextIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-11 h-13 sm:w-12 sm:h-14 bg-white/5 border rounded-xl text-center text-white text-xl font-bold outline-none transition-all focus:bg-white/10
            ${error ? 'border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border-white/10 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30'}
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;
