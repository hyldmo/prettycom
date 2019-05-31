import { Actions } from 'actions'
import Button from 'components/Button'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './Settings.scss'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const Settings: React.FunctionComponent<Props> = ({ filters, addFilter, removeFilter }) => {
	const [filter, setFilter] = useState('')
	return (
		<div className="settings">
			<h1>Settings</h1>
			<h2 title="Messages matching these messages are not displayed in the log">Filters</h2>
			<form action="javascript:void(0);" onSubmit={_ => addFilter(new RegExp(filter))}>
				<div className="field has-addons">
					<div className="control">
						<input
							className="input"
							title="Enter a valid regex"
							placeholder="Add regex filter"
							value={filter}
							onChange={e => setFilter(e.target.value)}
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
						<Button title="remove" types={['small', 'danger']} icon="times" onClick={_ => removeFilter(regex)} />
						</div>
					</li>
				))}
			</ul>
			<hr />
			<h2>Version: {process.env.PACKAGE_VERSION}</h2>
		</div>
	)
}

const mapStateToProps = (state: State) => ({
	...state.settings
})

const dispatchToProps = {
	addFilter: Actions.addFilter,
	removeFilter: Actions.removeFilter
}

export default connect(
	mapStateToProps,
	dispatchToProps
)(Settings)
