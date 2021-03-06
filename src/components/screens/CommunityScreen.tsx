import React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import { Header } from 'src/components'
import {
  ArticleList,
  MenuButton,
  MenuSelectModal,
} from 'src/containers'
import { withSafeArea } from 'src/wrappers'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const CommunityScreen: React.FunctionComponent<{}> = () => (
  <View style={styles.container}>
    <Header title="커뮤니티">
      <MenuButton />
    </Header>
    <ArticleList />
    <MenuSelectModal />
  </View>
)

export default withSafeArea(React.memo(CommunityScreen))
