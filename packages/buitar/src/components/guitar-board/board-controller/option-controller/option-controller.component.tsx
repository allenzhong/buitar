import { FC } from 'react'
import { useBoardContext } from '@/components/guitar-board/index'
import { instrumentConfig } from '@buitar/tone-player'
import { Instrument } from '@buitar/tone-player'
import { Icon } from '@/components/icon'
import {
	optionsUIConfig,
	instrumentUIConfig,
	boardStyleConfig,
	instrumentKeyboardConfig,
} from '@/pages/settings/config/controller.config'
import {
	GuitarBoardOptions,
	GuitarBoardOptionsKey,
	GuitarBoardThemeKey,
	InstrumentKeyboardKey,
} from '@/pages/settings/config/controller.type'
import { ControllerList, ControllerListProps } from '@/components/controller'
import cx from 'classnames'

import styles from './option-controller.module.scss'

export const BoardController: FC<
	ControllerListProps<any> & {
		controllerClassName?: string
	}
> = ({ controllerClassName, ...props }) => {
	return (
		<div className={cx(styles['container'], controllerClassName)}>
			<BoardOptionsController {...props} />
			<BoardInstrumentController {...props} />
			<BoardThemeController {...props} />
			<KeyBoardInstrument {...props} />
		</div>
	)
}

/**
 * 指板显示内容选项
 * @param props
 * @returns
 */
export const BoardOptionsController: FC<
	ControllerListProps<keyof GuitarBoardOptions> & {
		list?: GuitarBoardOptionsKey[]
	}
> = (props) => {
	const { boardOptions, dispatchBoardOptions } = useBoardContext()

	const handleClick = (option: keyof GuitarBoardOptions) => {
		dispatchBoardOptions({
			type: 'set',
			payload: { ...boardOptions, [option]: !boardOptions[option] },
		})
	}

	const renderOptionItem = (option: keyof GuitarBoardOptions) => {
		const checkedItem = boardOptions[option]
			? optionsUIConfig[option].checked
			: optionsUIConfig[option].unchecked
		const uncheckedItem = !boardOptions[option]
			? optionsUIConfig[option].checked
			: optionsUIConfig[option].unchecked

		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				{checkedItem.name_zh}
				<div className={styles['controller-inner-unchecked']}>{uncheckedItem.name_zh}</div>
				<div
					className={cx(
						styles['controller-inner-unchecked'],
						props.size !== 'small' && styles['controller-inner-intro']
					)}
				>
					{optionsUIConfig[option].others.intro_zh}
				</div>
			</div>
		)
	}

	const list = props.list || (Object.keys(optionsUIConfig) as GuitarBoardOptionsKey[])
	// 默认展示选中的option，若全都未选中，则展示「isShowSemitone」
	const checkedList = list.filter((option) => boardOptions[option])
	return (
		<ControllerList
			{...props}
			list={list}
			onClickItem={handleClick}
			renderListItem={renderOptionItem}
			checkedItem={(option) => boardOptions[option]}
			visibleItem={(option) => (checkedList.length > 0 ? false : option === 'isShowSemitone')}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}

/**
 * 指板播放乐器选项
 * @param props
 * @returns
 */
export const BoardInstrumentController: FC<ControllerListProps<Instrument>> = (props) => {
	const { instrument, dispatchInstrument } = useBoardContext()

	const renderInstrumentItem = (instrument: Instrument) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{instrumentUIConfig[instrument].name_zh}</span>
				<Icon name={instrumentUIConfig[instrument].icon} size={props.size === 'small' ? 16 : 30} />
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>
					音色
				</div>
			</div>
		)
	}

	const handleClick = (instrument: Instrument) => {
		dispatchInstrument({ type: 'set', payload: instrument })
	}

	return (
		<ControllerList
			{...props}
			list={Object.keys(instrumentConfig) as Instrument[]}
			onClickItem={handleClick}
			checkedItem={(item) => item === instrument}
			renderListItem={renderInstrumentItem}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}

/**
 * 指板播放乐器选项
 * @param props
 * @returns
 */
export const BoardThemeController: FC<ControllerListProps<GuitarBoardThemeKey>> = (props) => {
	const { boardTheme, dispatchBoardTheme } = useBoardContext()

	const renderThemeItem = (theme: GuitarBoardThemeKey) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{boardStyleConfig[theme].name}</span>
				<div className={styles['controller-inner-unchecked']}>{theme}</div>
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>
					乐器外观
				</div>
			</div>
		)
	}

	const handleClick = (theme: GuitarBoardThemeKey) => {
		dispatchBoardTheme({ type: 'set', payload: theme })
	}

	return (
		<ControllerList
			{...props}
			list={Object.keys(boardStyleConfig) as GuitarBoardThemeKey[]}
			onClickItem={handleClick}
			checkedItem={(item) => item === boardTheme}
			renderListItem={renderThemeItem}
			itemClassName={() => styles['controller-inner-option']}
		/>
	)
}

export const KeyBoardInstrument: FC<ControllerListProps<InstrumentKeyboardKey>> = (props) => {
	const { instrumentKeyboard, dispatchInstrumentKeyboard } = useBoardContext()

	const renderThemeItem = (key: InstrumentKeyboardKey) => {
		return (
			<div className={cx(styles['controller-inner'], styles[`controller-inner__${props.size}`])}>
				<span>{instrumentKeyboardConfig[key].name}</span>
				<div className={cx(styles['controller-inner-intro'], styles['controller-inner-unchecked'])}>
					乐器指板
				</div>
			</div>
		)
	}
	return (
		<ControllerList
			{...props}
			list={Object.keys(instrumentKeyboardConfig) as InstrumentKeyboardKey[]}
			renderListItem={renderThemeItem}
			onClickItem={(key) => dispatchInstrumentKeyboard({ type: 'set', payload: key })}
			checkedItem={(key) => key === instrumentKeyboard}
			itemClassName={() => styles['controller-inner-option']}
		></ControllerList>
	)
}
