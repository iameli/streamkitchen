import React, { Component } from "react";
import { bindComponent, watch } from "sp-components";
import CreateMyChannel from "./create-my-channel";
import { FlexContainer } from "./shared.style";
import { NoChannel, ChannelSelect } from "./home.style";
import { TitleBar, ChannelName, GoLiveButton } from "./channel.style.js";
import {
  Column,
  Stack,
  StackItem,
  StackDragWrapper,
  StackTitle,
  Output,
  OutputTitle,
  OutputButton
} from "./broadcast-detail.style";
import BroadcastStackItem from "./broadcast-stack-item";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import OutputCreate from "./output-create";

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

  toggleOutput(output) {
    const { broadcast } = this.props;
    const newBroadcastId =
      output.broadcastId === broadcast.id ? null : broadcast.id;
    this.props.SP.outputs.update(output.id, {
      broadcastId: newBroadcastId
    });
  }

  goLive() {
    const { SP, broadcast } = this.props;
    SP.broadcasts.update(broadcast.id, { active: true });
  }

  stopLive() {
    const { SP, broadcast } = this.props;
    SP.broadcasts.update(broadcast.id, { active: false });
  }

  deleteOutput(output) {
    if (!confirm(`Are you sure you want to delete ${output.title}?`)) {
      return;
    }
    const { SP } = this.props;
    SP.outputs.delete(output.id).catch(SP.log);
  }

  render() {
    if (!this.state.broadcast || !this.props.inputs || !this.props.outputs) {
      return <p>Loading...</p>;
    }
    const { broadcast } = this.state;
    const active = broadcast.active;
    let goLive;
    if (active) {
      goLive = (
        <GoLiveButton active onClick={() => this.stopLive()}>
          STOP
        </GoLiveButton>
      );
    } else {
      goLive = (
        <GoLiveButton onClick={() => this.goLive()}>GO LIVE</GoLiveButton>
      );
    }
    return (
      <FlexContainer>
        <TitleBar active={active}>
          <div>
            <ChannelName>
              Broadcast {this.props.broadcast.title}
            </ChannelName>
          </div>
          {active && <div>LIVE</div>}
          {goLive}
        </TitleBar>
        <DragDropContext onDragEnd={e => this.dragEnd(e)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) =>
              <Stack innerRef={provided.innerRef}>
                <StackTitle>ACTIVE</StackTitle>
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
                      <StackTitle
                        innerRef={provided.innerRef}
                        {...provided.dragHandleProps}
                        style={provided.draggableStyle}
                      >
                        INACTIVE
                      </StackTitle>
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
        <Column>
          <div>
            <StackTitle>OUTPUTS</StackTitle>
            {this.props.outputs.map(output =>
              <Output key={output.id}>
                <OutputTitle>
                  {output.title}
                </OutputTitle>
                <div>
                  <OutputButton
                    active={output.broadcastId === broadcast.id}
                    onClick={() => this.toggleOutput(output)}
                  >
                    {output.broadcastId === broadcast.id ? "ON" : "OFF"}
                  </OutputButton>
                  <OutputButton
                    onClick={() => {
                      this.deleteOutput(output);
                    }}
                  >
                    <i className="fa fa-times" />
                  </OutputButton>
                </div>
              </Output>
            )}
          </div>
          <OutputCreate />
        </Column>
      </FlexContainer>
    );
  }
}

export default bindComponent(BroadcastDetail);
