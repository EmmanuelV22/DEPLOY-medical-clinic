import React, { useState, useEffect } from "react";

const DarkMode = () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  const [isDarkMode, setIsDarkMode] = useState(savedDarkMode);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <label className="switch">
      <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
      <span className="slider">
        <span className="circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="22"
            height="22"
            x="0"
            y="0"
            viewBox="0 0 32 32"
            // style="enable-background:new 0 0 512 512"
            className="sun"
          >
            <g>
              <circle
                cx="16"
                cy="16"
                r="8.312"
                fill="currentColor"
                data-original="#000000"
              ></circle>
              <path
                d="M31.72 16.706a1.03 1.03 0 0 0 0-1.413l-2.816-3.023a1.037 1.037 0 0 1-.28-.831l.509-4.104c.072-.54-.291-1.05-.832-1.153l-4.062-.78a1.035 1.035 0 0 1-.707-.519l-1.994-3.616a1.037 1.037 0 0 0-1.35-.436l-3.751 1.756c-.27.125-.603.125-.873-.01L11.814.83a1.037 1.037 0 0 0-1.351.436L8.468 4.883c-.146.27-.406.457-.707.52L3.7 6.182c-.54.104-.904.613-.831 1.153l.509 4.104c.03.301-.063.602-.28.831L.28 15.293a1.03 1.03 0 0 0 0 1.413l2.815 3.024c.218.228.312.53.28.831l-.508 4.104c-.073.54.29 1.05.83 1.153l4.063.78c.301.062.561.249.707.519l1.994 3.615c.27.478.863.676 1.351.437l3.75-1.756c.27-.125.603-.125.873.01l3.751 1.746c.488.239 1.08.041 1.35-.437l1.995-3.615c.146-.27.406-.457.707-.52l4.062-.779c.54-.104.904-.613.832-1.153l-.51-4.104a1.037 1.037 0 0 1 .28-.831l2.816-3.023zM16 26.39c-5.725 0-10.39-4.665-10.39-10.39S10.275 5.61 16 5.61 26.39 10.275 26.39 16 21.725 26.39 16 26.39z"
                fill="currentColor"
                data-original="#000000"
              ></path>
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 512 512"
            height="22"
            width="22"
            className="moon"
          >
            <g clip-path="url(#clip0_68_17)">
              <path
                fill="currentColor"
                d="M355.2 142.08C355.2 162.133 338.773 178.56 318.72 178.56C298.667 178.56 282.453 162.133 282.453 142.08C282.453 122.027 298.667 105.813 318.72 105.813C338.773 105.813 355.2 122.027 355.2 142.08Z"
              ></path>
              <path
                fill="currentColor"
                d="M151.253 283.52C142.72 283.52 135.893 290.347 135.893 298.88C135.893 307.413 142.72 314.453 151.253 314.453C159.787 314.453 166.613 307.413 166.613 298.88C166.613 290.347 159.787 283.52 151.253 283.52ZM151.253 283.52C142.72 283.52 135.893 290.347 135.893 298.88C135.893 307.413 142.72 314.453 151.253 314.453C159.787 314.453 166.613 307.413 166.613 298.88C166.613 290.347 159.787 283.52 151.253 283.52ZM501.12 271.147C495.573 268.8 491.947 263.253 491.947 257.067C491.947 250.88 495.573 245.333 501.12 242.987C507.947 240.213 511.787 233.387 510.933 226.347C495.573 97.4933 385.92 0.213318 256 0.213318C197.547 0.213318 142.72 19.4133 97.2799 55.4667C91.7333 59.9467 89.8133 67.6267 92.5866 74.4533C93.2266 75.52 93.4399 77.0133 93.4399 79.1467C93.4399 87.4667 86.3999 94.5066 78.0799 94.5066C75.9466 94.5066 74.4533 94.2933 73.3866 93.6533C70.1379 92.2903 66.5363 92.0107 63.1161 92.8562C59.696 93.7016 56.6395 95.627 54.3999 98.3467C18.1333 143.787 -0.853394 198.613 -0.853394 257.067C-0.853394 398.72 114.347 513.92 256 513.92C385.92 513.92 495.573 416.64 510.933 287.787C511.367 284.318 510.64 280.804 508.864 277.793C507.089 274.782 504.365 272.445 501.12 271.147ZM151.253 346.453C125.227 346.453 103.893 325.12 103.893 298.88C103.893 272.853 125.227 251.52 151.253 251.52C177.493 251.52 198.613 272.853 198.613 298.88C198.613 325.12 177.493 346.453 151.253 346.453ZM318.72 430.08C292.693 430.08 271.36 408.96 271.36 382.72C271.36 356.48 292.693 335.36 318.72 335.36C344.96 335.36 366.293 356.48 366.293 382.72C366.293 408.96 344.96 430.08 318.72 430.08ZM318.72 210.56C281.173 210.56 250.453 179.84 250.453 142.08C250.453 104.533 281.173 73.8133 318.72 73.8133C356.48 73.8133 387.2 104.533 387.2 142.08C387.2 179.84 356.48 210.56 318.72 210.56ZM318.72 367.36C310.4 367.36 303.36 374.187 303.36 382.72C303.36 391.253 310.4 398.08 318.72 398.08C327.253 398.08 334.293 391.253 334.293 382.72C334.293 374.187 327.253 367.36 318.72 367.36ZM151.253 283.52C142.72 283.52 135.893 290.347 135.893 298.88C135.893 307.413 142.72 314.453 151.253 314.453C159.787 314.453 166.613 307.413 166.613 298.88C166.613 290.347 159.787 283.52 151.253 283.52Z"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_68_17">
                <rect fill="currentColor" height="512" width="512"></rect>
              </clipPath>
            </defs>
          </svg>
        </span>
      </span>
    </label>
  );
};

export default DarkMode;
