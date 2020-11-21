import React from 'react'

function openLink (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
	e.preventDefault()
	window.nodeOpen(e.currentTarget.href)
}

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export const Anchor: React.FunctionComponent<Props> = (props) => (
	<a {...props} onClick={openLink}/>
)
