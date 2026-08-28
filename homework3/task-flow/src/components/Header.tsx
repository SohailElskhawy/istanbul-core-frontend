interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'TaskFlow',
  subtitle = 'Organize your tasks. Stay productive.',
}) => {
  return (
    <header className="app-header">
      <div className="header-badge">React & TypeScript</div>
      <h1 className="header-title">{title}</h1>
      <p className="header-subtitle">{subtitle}</p>
    </header>
  );
};