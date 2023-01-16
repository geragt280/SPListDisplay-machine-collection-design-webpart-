import * as React from 'react'
import { IDisplayCollectionProps } from './IDisplayCollectionProps'

export default class NoListSelected extends React.Component<IDisplayCollectionProps, {}> {
  render() {
    return (
      <div>No list selected goto pane configuration to setup Webpart</div>
    )
  }
}
