import React, {useState} from 'react'

interface Command {
  name: string
  icon: React.ReactElement | string
}

interface GroupCommands {
  [category: string]: Command[]
}

export interface CommandKProps {
  commands?: GroupCommands
}

const CommandK = (props: CommandKProps) => {
  const {commands = {}} = props

  const [searchQuery, setSearchQuery] = useState<string>('')

  return (
    <div className='flex justify-center items-center h-[440px]'>
      <div className='relative'>
        <div className='absolute -top-[25px] left-[10px] -rotate-[40deg]'>
          <KeyboardKey className='items-end w-[100px] text-xs'>
            <div>⌘</div>
            <div>command</div>
          </KeyboardKey>
        </div>
        <div className='absolute -top-[30px] z-[2] rotate-[15deg] right-[30px] bg-[rgb(22_22_22)]'>
          <KeyboardKey className='text-xs h-9 w-9'>K</KeyboardKey>
        </div>

        <div className="w-[460px] h-[304px] p-2 border border-white/10 rounded-xl relative backdrop-blur-2xl flex flex-col before:pointer-events-none before:content-[''] before:shadow-[0_-28px_84px_-24px_rgba(255,255,255,0.1)_inset] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[inherit]">
          <div className='p-1.5'>
            <div className='rounded-md bg-white/[0.08] text-white/[0.55] px-2 py-[3px] font-normal text-xs inline-block'>
              Actions
            </div>
          </div>
          <input
            type='text'
            placeholder='Type a command or search...'
            onChange={(e) => setSearchQuery(e.target.value)}
            className='px-2 py-3 bg-transparent font-[inherit] border-0 w-full text-white/[0.65] border-b border-white/[0.08] placeholder:text-white/50 outline-none'
          />

          <div className='pt-1.5 flex flex-col flex-1 overflow-y-auto'>
            {Object.entries(commands).map(([category, categoryCommands]) => (
              <div key={category}>
                <div
                  className={`px-1.5 flex items-center text-white/[0.55] text-xs transition-all duration-[350ms] ease-[cubic-bezier(.6,.6,0,1)] h-[30px] ${
                    !!searchQuery ? 'h-0 opacity-0 pointer-events-none' : ''
                  }`}
                >
                  {category}
                </div>
                {categoryCommands.map((command, i) => {
                  const isMatch = command.name
                    .toLocaleLowerCase()
                    .includes(searchQuery.toLocaleLowerCase())
                  return (
                    <CommandItem
                      key={category + i}
                      icon={command.icon}
                      title={command.name}
                      isActive={isMatch}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CommandItem = ({title, icon, isActive}: any) => {
  return (
    <div
      className={`px-3 h-9 flex items-center gap-3 text-white/75 text-[13px] transition-all duration-[350ms] ease-[cubic-bezier(.6,.6,0,1)] rounded-lg cursor-pointer hover:bg-white/[0.06] [&_svg]:text-inherit [&_svg]:w-4 [&_svg]:h-4 [&_img]:w-4 [&_img]:h-auto ${
        !isActive ? 'opacity-0 h-0 pointer-events-none' : ''
      }`}
    >
      {typeof icon === 'string' ? <img src={icon} /> : icon}
      <div>{title}</div>
    </div>
  )
}

interface KeyboardKeyProps {
  children: React.ReactNode
  className?: string
}

const KeyboardKey = (props: KeyboardKeyProps) => {
  return (
    <div
      className={`text-[10px] h-11 w-11 flex items-center justify-center flex-col rounded-[5px] bg-white/[0.01] shadow-[0_0_0_1px_#414143] text-white/75 gap-0.5 leading-4 px-2 py-1 relative before:absolute before:border before:border-white/5 before:content-[''] before:top-0 before:left-0 before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:pointer-events-none before:rounded-[inherit] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:pointer-events-none after:rounded-[inherit] after:bg-gradient-to-b after:from-transparent after:to-white/[0.08] ${
        props.className || ''
      }`}
    >
      {props.children}
    </div>
  )
}

export default CommandK
