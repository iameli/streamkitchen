import React, { Component } from "react";
import { bindComponent, watch } from "sp-components";
import CreateMyChannel from "./create-my-channel";
import { FlexContainer } from "./shared.style";
import { NoChannel, ChannelSelect } from "./home.style";
import { TitleBar, ChannelName } from "./channel.style.js";
import {
  Column,
  Stack,
  StackItem,
  StackDragWrapper
} from "./broadcast-detail.style";
import BroadcastStackItem from "./broadcast-stack-item";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export class BroadcastDetail extends Component {
  static propTypes = {
    channels: React.PropTypes.array,
    ready: React.PropTypes.bool,
    broadcast: React.PropTypes.object,
    inputs: React.PropTypes.array,
    outputs: React.PropTypes.array,
    SP: React.PropTypes.object
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

  componentWillReceiveProps(props) {
    this.setState({ broadcast: props.broadcast });
  }

  dragEnd(e) {
    if (!e.destination) {
      return;
    }
    const { SP } = this.props;
    const { broadcast } = this.state;
    const inputId = e.draggableId;
    const isActive = broadcast.sources.map(s => s.id).includes(inputId);
    let activeIdx = broadcast.sources.length;
    const newIdx = e.destination.index;
    if (isActive && activeIdx >= newIdx) {
      activeIdx -= 1;
    }
    let newSources = [...this.state.broadcast.sources];
    if (newIdx <= activeIdx) {
      newSources = broadcast.sources.filter(s => s.id !== inputId);
      newSources.splice(newIdx, 0, {
        kind: "Input",
        id: inputId
      });
    } else {
      // Deactivate, or... reorder inputs? tbh idk about that one
      newSources = broadcast.sources.filter(s => s.id !== inputId);
    }
    SP.broadcasts
      .update(broadcast.id, {
        sources: newSources
      })
      .catch(err => SP.log(err));
    this.setState({
      broadcast: {
        ...this.state.broadcast,
        sources: newSources
      }
    });
  }

  inactiveInputs() {
    const inputSet = this.state.broadcast.sources.map(source => source.id);
    return this.props.inputs.filter(input => !inputSet.includes(input.id));
  }

  getInput(id) {
    return this.props.inputs.find(i => i.id === id);
  }

  render() {
    if (!this.state.broadcast || !this.props.inputs || !this.props.outputs) {
      return <p>Loading...</p>;
    }
    const active = false;
    return (
      <FlexContainer>
        <TitleBar active={active}>
          <div>
            <ChannelName>
              Broadcast {this.props.broadcast.title}
            </ChannelName>
          </div>
          {active && <div>LIVE</div>}
        </TitleBar>
        <DragDropContext onDragEnd={e => this.dragEnd(e)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) =>
              <Stack innerRef={provided.innerRef}>
                <h4>Active Inputs</h4>
                {this.state.broadcast.sources.map(source =>
                  <Draggable key={source.id} draggableId={source.id}>
                    {(provided, snapshot) =>
                      <div>
                        <StackDragWrapper
                          innerRef={provided.innerRef}
                          {...provided.dragHandleProps}
                          style={provided.draggableStyle}
                        >
                          <StackItem>
                            {this.getInput(source.id).title}
                          </StackItem>
                        </StackDragWrapper>
                        {provided.placeholder}
                      </div>}
                  </Draggable>
                )}
                <Draggable
                  key="inactive-title"
                  draggableId="inactive-title"
                  isDragDisabled={true}
                >
                  {(provided, snapshot) =>
                    <div>
                      <h4
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        style={provided.draggableStyle}
                      >
                        Inactive Inputs
                      </h4>
                      {provided.placeholder}
                    </div>}
                </Draggable>
                {this.inactiveInputs().map(input =>
                  <Draggable key={input.id} draggableId={input.id}>
                    {(provided, snapshot) =>
                      <div>
                        <StackDragWrapper
                          innerRef={provided.innerRef}
                          {...provided.dragHandleProps}
                          style={provided.draggableStyle}
                        >
                          <StackItem>
                            {input.title}
                          </StackItem>
                        </StackDragWrapper>
                        {provided.placeholder}
                      </div>}
                  </Draggable>
                )}
              </Stack>}
          </Droppable>
        </DragDropContext>
        {/* <Column>
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
        </Column> */}
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
