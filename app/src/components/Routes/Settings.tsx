import { Actions } from 'actions'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

const About: React.StatelessComponent<Props> = ({ version, fetchVersion }) => {

	return (
		<>
			<h1>About {process.env.PACKAGE_NAME}</h1>
			<h2></h2>
			<h2>
				Version: {process.env.PACKAGE_VERSION}
			</h2>
		</>
	)
}

const mapStateToProps = (state: State) => ({
	version: state.version
})

const dispatchToProps = {
	fetchVersion: Actions.fetchVersion
}

export default connect(
	mapStateToProps,
	dispatchToProps
)(About)
