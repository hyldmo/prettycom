import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import './Commands.scss'
import { sleep } from 'utils'

type Props = {
	commands: string[]
	active?: boolean
	visible: boolean
	onFinished?: () => void
	onSend?: (command: string) => void
}

export const Commands: React.FunctionComponent<Props> = (props) => {
	const { commands, active, visible, onSend, onFinished } = props
	const [line, setLine] = useState(0)

	useEffect(() => {
		if (active) {
			run()
		} else {
			setLine(0)
		}

		async function run () {
			await sleep(200)
			let nextLine: number
			const [cmd, ...params] = commands[line].toLocaleUpperCase().split(' ')
			console.log(cmd, params)
			switch (cmd) {
				case 'WAIT':
					await sleep(Number.parseFloat(params[0]) * 1000)
					nextLine = line + 1
					break

				case 'GOTO':
					nextLine = Number.parseInt(params[0], 10) - 1
					break

				default:
					onSend && onSend(commands[line])
					nextLine = line + 1
					break
			}
			if (nextLine >= commands.length) {
				console.log('finished')
				onFinished && onFinished()
				setLine(0)
			} else {
				setLine(nextLine)
			}
		}
	}, [active, line])

	return visible ? (
		<table className="commands">
			<tbody>
				{commands.map((content, i) => {
					const isActive = active && (line == i)
					return (
						<tr key={i} className="line">
						<td className="line__pos">{isActive ? '>' : <span>&nbsp;</span>}</td>
						<td className={cn('line__number', { active: isActive })}>{i + 1}</td>
						<td className="line__content">{content}</td>
					</tr>
					)
				})}
			</tbody>
		</table>
	) : (
		null
	)
}
