import '../styles/AuthFormWrapper.css';

export default function AuthFormWrapper({ title, children }) {
  return (
    <div className="auth-page d-flex justify-content-center align-items-center">
      <div className="auth-box shadow-lg rounded p-4">
        <h1 className="auth-title text-center mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
}
