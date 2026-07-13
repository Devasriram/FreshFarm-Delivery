function Button({
  text,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;