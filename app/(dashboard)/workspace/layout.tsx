import React, { ReactNode } from 'react'
import { WorkSpaceList } from './_components/WorkSpaceList'
import { CreateWorkSpace } from './_components/CreateWorkSpace'
import { UserNav } from './_components/UserNav'

const WorkSpaceLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex w-full h-screen'>
      <div className='flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border'>
        <WorkSpaceList />
        <div className='mt-4'>
          <CreateWorkSpace />
        </div>

        <div className='mt-auto'>
          <UserNav/>
        </div>
      </div>
      {children}
    </div>
  )
}

export default WorkSpaceLayout