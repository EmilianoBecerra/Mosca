import "./Header.css";

export function Header() {
    return (
        <header>
            <h1>La Mosca</h1>
            <nav className="nav-list">
                <ul className="ul-header">
                    <li>Crear Mesa</li>
                    <li>Torneo</li>
                    <li>Tienda</li>
                    <li>Instrucciones</li>
                </ul>
            </nav>
        </header>
    )
}