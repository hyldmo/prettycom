import { Actions } from 'actions'
import Button from 'components/Button'
import { Anchor } from 'components/Anchor'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Settings.scss'
import { DEFAULT_PORT } from 'consts'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Settings: React.FunctionComponent<Props> = (props) => {
	const { messageLimit, filters, hideUnknown, logDefault, addFilter, removeFilter, setHideUnknown, setMessageLimit, setRemote, setDefaultLog } = props
	const [filter, setFilter] = useState('')
	return (
		<div className="settings">
			<h1 className="title is-3">Settings</h1>
			<label className="checkbox">
				<input type="checkbox" checked={logDefault} onChange={e => setDefaultLog(e.target.checked)}/>
				<span>Enable logging by default</span>
			</label>
			<label className="checkbox">
				<input type="checkbox" checked={hideUnknown} onChange={e => setHideUnknown(e.target.checked)}/>
				<span>Hide uknown devices from list</span>
			</label>
			<label>
				<input type="number" className="input is-small" value={messageLimit} onChange={e => setMessageLimit(Number.parseInt(e.target.value, 10))}/>
				<span>Message limit</span>
			</label>

			<h2 className="title is-4">Filters</h2>
			<p className="subtitle">Messages matching these messages are not displayed in the log</p>
			<form onSubmit={e => {e.preventDefault(); addFilter(new RegExp(filter))}}>
				<div className="field has-addons">
					<div className="control">
						<input
							className="input"
							title="Enter a valid regex"
							placeholder="Add regex filter"
							value={filter}
							onChange={e => setFilter(e.target.value)}
							required
						/>
					</div>
					<div className="control">
						<Button type="submit" types={['success']} title="Add filter" icon="plus" />
					</div>
				</div>
			</form>
			<ul className="filters">
				{filters.map(regex => (
					<li key={regex.source} className="field has-addons">
						<div className="control">
							<input className="input is-small" readOnly value={regex.source.replace(/(^\\\/)|(\\\/$)/g, '/')} />
						</div>
						<div className="control">
						<Button title="remove" types={['small', 'danger']} icon="times" onClick={() => removeFilter(regex)} />
						</div>
					</li>
				))}
			</ul>
			<h2 className="title is-4">Remote</h2>
			<label className="checkbox is-large">
				<input type="checkbox" checked={props.remotePort !== null} onChange={() => setRemote(props.remotePort === null ? '' : null)} />
				<span>Allow remote connections</span>
			</label>
			{props.remotePort !== null && (<label>
				<input type="number" className="input is-small" placeholder={DEFAULT_PORT.toString()}
					min={1024} value={props.remotePort || ''} onChange={e => setRemote(e.target.value)}
				/>
				<span>Port</span>
			</label>)}
			<hr />
			<span>Version: {process.env.PACKAGE_VERSION}</span>
			<Anchor className="gh" href={`${process.env.PACKAGE_REPO}`}>Github</Anchor>
		</div>
	)
}

const mapStateToProps = (state: State) => ({
	...state.settings
})

const dispatchToProps = {
	addFilter:  Actions.addFilter,
	removeFilter: Actions.removeFilter,
	setHideUnknown: Actions.setHideUnknown,
	setMessageLimit: Actions.setMessageLimit,
	setRemote: Actions.setRemote,
	setDefaultLog: Actions.setDefaultLog
}

export default connect(
	mapStateToProps,
	dispatchToProps
)(Settings)
