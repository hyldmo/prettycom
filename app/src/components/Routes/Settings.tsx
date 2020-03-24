import { Actions } from 'actions'
import Button from 'components/Button'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Settings.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Settings: React.FunctionComponent<Props> = (props) => {
	const { messageLimit, filters, hideUnknown, addFilter, removeFilter, setHideUnknown, setMessageLimit } = props
	const [filter, setFilter] = useState('')
	return (
		<div className="settings">
			<h1 className="title is-3">Settings</h1>
			<label className="checkbox">
				<input type="checkbox" checked={hideUnknown} onChange={e => setHideUnknown(e.target.checked)}/>
				<span>Hide uknown devices from list</span>
			</label>
			<label>
				<input type="number" className="input is-small" value={messageLimit} onChange={e => setMessageLimit(Number.parseInt(e.target.value, 10))}/>
				<span>Message limit</span>
			</label>
			<h2 className="title is-4" title="Messages matching these regex filters are not displayed">Filters</h2>
			<p className="subtitle">Messages matching these messages are not displayed in the log</p>
			<form action="javascript:void(0);" onSubmit={_ => addFilter(new RegExp(filter))}>
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
			<hr />
			<span>Version: {process.env.PACKAGE_VERSION}</span>
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
	setMessageLimit: Actions.setMessageLimit
}

export default connect(
	mapStateToProps,
	dispatchToProps
)(Settings)
