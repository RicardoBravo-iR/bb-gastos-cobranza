import styles from "@/styles/layout.module.css";
import Sidebar from "../sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {

	const layoutContainer = styles["layout-container"];
	const mainContainer = styles["main-container"];

	return (
		<div className={layoutContainer}>
			<Sidebar />
			
			<main className={mainContainer}>{children}</main>
		</div>
	)
}