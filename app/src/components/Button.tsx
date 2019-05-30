import cn from 'classnames'
import React from 'react'

type Props = React.HTMLProps<HTMLButtonElement> & {
	title?: string
	types?: Array<string | number | undefined | null | boolean>
	icon?: string
	solid?: boolean
}

export type ButtonProps = Props & ({ title: string } | { children: React.ReactNode })

const mapTypes = (types: Props['types']) => types && types.filter(t => !!t).map(type => `is-${type}`)

export const Button: React.StatelessComponent<Props> = ({ solid, types, className, children, icon, onClick, ...rest }) => (
	<button
		className={cn('button', className, mapTypes(types), { 'is-outlined': !solid })}
		onClick={e => { if (onClick) onClick(e); e.currentTarget.blur() }}
		{...rest}
	>
			{icon && (
			<span className="icon">
				<i className={`fas fa-${icon}`} />
			</span>
		)}
		{(!!children && !!icon) && <span>&nbsp;</span>}
		{children}
	</button>
)

Button.defaultProps = {
	solid: true
}

export default Button
