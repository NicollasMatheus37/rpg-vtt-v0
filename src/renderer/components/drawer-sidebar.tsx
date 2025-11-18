import React, { useEffect, useRef } from 'react';

export function DrawerSidebar({ label, children, id, isOpen, onOpen, onClose }: {
	label?: string,
	children?: React.ReactNode,
	id: string,
	isOpen?: boolean,
	onOpen?: () => void,
	onClose?: () => void,
}) {
	const drawerId = id || 'sidebarDrawer';
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (checkboxRef.current) {
			checkboxRef.current.checked = isOpen ?? false;
		}
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			onClose?.();
		} else {
			onOpen?.();
		}
	};

	return (
		<div className="drawer" key={id}>
			<input 
				ref={checkboxRef}
				id={drawerId} 
				type="checkbox" 
				className="drawer-toggle"
				onChange={handleChange}
			/>
			<div className="drawer-content">
				{/* Page content here */}
				<label 
					htmlFor={drawerId} 
					className="btn drawer-button"
					onClick={() => {
						if (checkboxRef.current && !isOpen) {
							checkboxRef.current.checked = true;
						}
					}}
				>
					{label}
				</label>
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