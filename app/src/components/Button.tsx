import cn from 'classnames'
import React from 'react'

type Props<P> = React.HTMLProps<HTMLButtonElement | HTMLAnchorElement> & {
	title?: string
	element?: React.ReactElement<P>
	types?: Array<string | number | undefined | null | boolean>
	icon?: string
	solid?: boolean
}

export type ButtonProps<P> = Props<P> & ({ title: string } | { children: React.ReactNode })

const mapTypes = (types: Props<never>['types']) => types && types.filter(t => !!t).map(type => `is-${type}`)

export function Button<P> (props: Props<P>) {
	const { solid, element = <button />, types, className, children, icon, onClick, ...rest } = props
	return (
		<element.type
			{...element.props}
			className={cn('button', className, mapTypes(types), { 'is-outlined': !solid })}
			onClick={(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => { if (onClick) onClick(e); e.currentTarget.blur() }}
			{...rest}
		>
				{icon && (
				<span className="icon">
					<i className={`fas fa-${icon}`} />
				</span>
			)}
			{(!!children && !!icon) && <span>&nbsp;</span>}
			{children}
		</element.type>
	)
}

Button.defaultProps = {
	solid: true
}

export default Button
