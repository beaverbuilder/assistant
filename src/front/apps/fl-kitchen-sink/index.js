import React, { Fragment } from 'react'
import {
    ScreenHeader,
    TagGroup,
    Tag,
    Padding,
    Separator,
    Heading,
    Icon,
} from 'components'

export const KitchenSinkTab = props => {
    return (
        <Fragment>
            <ScreenHeader>

            </ScreenHeader>

            <Padding>
                <Heading>Tags & Tag Groups</Heading>
                <TagGroup title="Normal Tag Group">
                    <Tag>One</Tag>
                    <Tag isSelected={true}>Two (selected)</Tag>
                    <Tag>Three</Tag>
                    <Tag count="23">Four (with count)</Tag>
                    <Tag>Five</Tag>
                </TagGroup>
                <TagGroup title="Muted (appearance) Tag Group" appearance="muted">
                    <Tag isSelected={true}>Alligator (selected)</Tag>
                    <Tag>Squirrel</Tag>
                    <Tag>Turtle</Tag>
                    <Tag count="23">Cow (with count)</Tag>
                    <Tag>Gopher</Tag>
                    <Tag count="13,203">Armadillo</Tag>
                </TagGroup>
                <TagGroup title="Vibrant (appearance) Tag Group" appearance="vibrant">
                    <Tag>One</Tag>
                    <Tag>Two</Tag>
                    <Tag>Three</Tag>
                    <Tag count="23">Four (with count)</Tag>
                    <Tag isSelected={true}>Five (selected)</Tag>
                </TagGroup>
            </Padding>
            <Separator />
        </Fragment>
    )
}

export const KitchenSinkIcon = props => {
    return (
        <Icon />
    )
}
