import React, { Component } from "react";
import { bindComponent, watch } from "sp-components";
import CreateMyChannel from "./create-my-channel";
import { FlexContainer } from "./shared.style";
import { NoChannel, ChannelSelect } from "./home.style";
import { TitleBar, ChannelName } from "./channel.style.js";
import { Column, Stack } from "./broadcast-detail.style";
import BroadcastStackItem from "./broadcast-stack-item";

export class BroadcastDetail extends Component {
  static propTypes = {
    channels: React.PropTypes.array,
    ready: React.PropTypes.bool,
    broadcast: React.PropTypes.object,
    inputs: React.PropTypes.array,
    outputs: React.PropTypes.array
  };

  static subscribe(props) {
    return {
      broadcast: watch.one("broadcasts", { id: props.broadcastId }),
      inputs: watch("inputs", { userId: props.SP.user.id }),
      outputs: watch("outputs", { userId: props.SP.user.id })
    };
  }

  constructor() {
    super();
    this.state = {};
  }

  renderStack() {
    if (this.props.broadcast.sources.length === 0) {
      return (
        <div>
          <em>Broadcast has no inputs</em>
        </div>
      );
    }
    return this.props.broadcast.sources.map(source =>
      <BroadcastStackItem>
        {source.type}
        {source.id}
      </BroadcastStackItem>
    );
  }

  render() {
    if (!this.props.broadcast || !this.props.inputs || !this.props.outputs) {
      return <p>Loading...</p>;
    }
    const active = false;
    return (
      <FlexContainer padded>
        <TitleBar active={active}>
          <div>
            <ChannelName>
              Broadcast {this.props.broadcast.title}
            </ChannelName>
          </div>
          {active && <div>LIVE</div>}
        </TitleBar>
        <Column>
          <h4>Playlist</h4>
          {this.renderStack()}
          <h4>Available Inputs</h4>
          <Stack>
            {this.props.inputs.map(input =>
              <BroadcastStackItem key={input.id}>
                {input.title}
              </BroadcastStackItem>
            )}
          </Stack>
        </Column>
        <Column>
          <h4>Outputs</h4>
          {this.props.outputs.map(output =>
            <Stack>
              <BroadcastStackItem key={output.id}>
                {output.id}
              </BroadcastStackItem>
            </Stack>
          )}
        </Column>
      </FlexContainer>
    );
  }
}

export default bindComponent(BroadcastDetail);
