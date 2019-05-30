
import cn from 'classnames'
import React from 'react'

type Props = React.HTMLProps<HTMLButtonElement> & {
	title?: string
	types?: Array<string | number | undefined | null | boolean>
	icon?: string
	active?: boolean
}

export type ButtonProps = Props & ({ title: string } | { children: React.ReactNode })

export const Button: React.StatelessComponent<Props> = ({ active, types, className, children, icon, ...rest }) => (
	<button className={cn('button', className, types && types.filter(t => !!t).map(type => `is-${type}`), { 'is-outlined': !active })} {...rest}>
		{icon && (
			<span className="icon">
				<i className={`fas fa-${icon}`} />
			</span>
		)}
		{(!!children && !!icon) && <span>&nbsp;</span>}
		{children}
	</button>
)

export default Button
