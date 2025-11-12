import React from 'react';

export function DrawerSidebar({ label, children, key }: {
	label?: string,
	children?: React.ReactNode,
	key: string,
}) {
	const drawerId = key || 'sidebarDrawer';

	return (
		<div className="drawer" key={key}>
			<input id={drawerId} type="checkbox" className="drawer-toggle"/>
			<div className="drawer-content">
				{/* Page content here */}
				<label htmlFor={drawerId} className="btn drawer-button">{label}</label>
			</div>
			<div className="drawer-side">
				<label htmlFor={drawerId} aria-label="close sidebar" className="drawer-overlay"></label>
				{/* Drawer content here */}
				<ul className="menu bg-base-200 min-h-full w-80 p-4">
					{children}
				</ul>
			</div>
		</div>
	);
}