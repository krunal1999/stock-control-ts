export const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  options = [],
  isSelect = false,
  handleChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  options?: string[];
  isSelect?: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) => {
  return (
    <div>
      <label className="block text-md font-medium text-text-light dark:text-text-dark">
        {label}
      </label>
      {isSelect ? (
        <select
          name={name}
          className="input rounded-2xl w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          onChange={handleChange}
          required
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          className="input rounded-2xl w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          placeholder={placeholder}
          onChange={handleChange}
          required
        />
      )}
    </div>
  );
};
