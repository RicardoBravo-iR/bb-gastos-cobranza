import styles from "@/styles/sidebar.module.css";
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  const sidebarContainer = styles["sidebar-container"];
  const logoContainer = styles["logo-container"];
  const sidebar = styles["sidebar"];
  const listOptions = styles["list-options"];
  const optionNav = styles["option-nav"];
  const optionLink = styles["option-link"];
  const logoutContainer = styles["logout-container"];
  const logoutText = styles["logout-text"];

	return (
		<aside className={sidebarContainer}>
			<div className={logoContainer}>
				<Image src="/logo-bb.png" alt="logo" width={313} height={47} />
			</div>
			
			<nav className={sidebar}>
				<ul className={listOptions}>
					<li className={optionNav}>
						<Link href="/parametros-generales" className={optionLink}>
							<span>Parámetros Generales de Gastos de Cobranza</span>
						</Link>
					</li>
					<li className={optionNav}>
						<Link href="/tarifario-gastos-cobranza" className={optionLink}>
							<span>Tarifario de Gastos de Cobranza</span>
						</Link>
					</li>
					<li className={optionNav}>
						<Link href="/option-3" className={optionLink}>
							<span>Clientes a excluir en Gastos de Cobranza</span>
						</Link>
					</li>
					<li className={optionNav}>
						<Link href="/option-4" className={optionLink}>
							<span>Bines a excluir en Gastos de Cobranza</span>
						</Link>
					</li>
					<li className={optionNav}>
						<Link href="/option-4" className={optionLink}>
							<span>Estatus de Cuenta a excluir en Gastos de Cobranza</span>
						</Link>
					</li>
				</ul>

				<div className={logoutContainer}>
					<p className={logoutText}>
						Cerrar Sesión
					</p>
				</div>
			</nav>
		</aside>
	)
}
