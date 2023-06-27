import { useState, useEffect } from "react";

function AnimatedNumber({
  value,
  startValue = 0,
  duration = 1000,
  generateCommas = false,
  generateDecimals = false,
  count=4
}) {
  const [returnValue, setReturnValue] = useState(value);

  useEffect(() => {
    let timeOutID;
    let startTime;
    let currentTime;
    let elapsedTime;
    let progress;
    let currentValue;
    const updateValue = () => {
      currentTime = new Date().getTime();
      elapsedTime = currentTime - startTime;
      progress = Math.min(1, elapsedTime / duration);
      currentValue = startValue - (startValue - value) * progress;

      setReturnValue(currentValue);

      if (elapsedTime < duration) timeOutID = setTimeout(updateValue, 16);
    };

    startTime = new Date().getTime();
    timeOutID = setTimeout(updateValue, 16);

    return () => {
      clearTimeout(timeOutID);
    };
  }, [value, duration]);

  let finalValue = returnValue.toString();
  if (generateDecimals) {
    finalValue = `${toFixedNoRound(finalValue, count)}`;
  } else {
    finalValue = `${Number(finalValue).toFixed(0)}`;
  }
  if (generateCommas)
    finalValue = finalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${finalValue}`;
}

export default AnimatedNumber;

function toFixedNoRound(num, count) {
  const str = num.toString(10);
  const [intPart, decPart] = str.split(".");
  if (decPart) return `${intPart}.${decPart.slice(0, count).padEnd(2, "0")}`;
  return `${str}.${"0".repeat(2)}`;
}
