import React from 'react'
import { connect } from 'react-redux'
import { CharacterStatus } from 'src/components'
import { CharacterStatusProps } from 'src/components/user/CharacterStatus'
import {
  AppState,
  getSelectedCharacter,
  getDailyProgress,
} from 'src/store/selectors'
import { today } from 'src/utils'

const DailyCharacterStatusContainer: React.SFC<CharacterStatusProps> = props => <CharacterStatus { ...props } />

const mapStateToProps = (state: AppState) => ({
  name: getSelectedCharacter(state).name,
  progress: getDailyProgress(state, today()),
})

export default connect(mapStateToProps)(DailyCharacterStatusContainer)