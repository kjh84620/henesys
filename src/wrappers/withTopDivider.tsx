import React from 'react'
import {
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollViewProps,
} from 'react-native'
import { Divider } from 'src/components'

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 8,
  },
})

function withTopDivider<T extends ScrollViewProps>(Component: React.ComponentType<T>) {
  return class WithTopDivider extends React.PureComponent<T> {
    state = { showDivider: false }

    _onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => this.setState({
      showDivider: nativeEvent.contentOffset.y > 0,
    })

    render() {
      const { showDivider } = this.state
      return (
        <React.Fragment>
          <Divider hidden={!showDivider} />
          <Component
            onScroll={this._onScroll}
            scrollEventThrottle={160}
            contentContainerStyle={styles.contentContainer}
            {...this.props}
          />
        </React.Fragment>
      )
    }
  }
}

export default withTopDivider
