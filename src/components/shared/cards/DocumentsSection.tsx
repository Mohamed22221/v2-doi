import { Card, Button } from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'
import { TFunction } from 'i18next'
import { HiOutlineDownload } from 'react-icons/hi'
import SectionHeader from './SectionHeader'

export type Document = {
    id: string
    type: string
    title: string
    image: string
    fileUrl: string
}

type DocumentsSectionProps = {
    title?: string
    documents: Document[]
    t: TFunction
    documentTitleKey?: (type: string) => string
}

const DocumentsSection = ({ title, documents, t, documentTitleKey }: DocumentsSectionProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'commercial_certificate':
                return <Icon name="commercialRegister" />
            case 'tax_certificate':
                return <Icon name="taxCard" />
            case 'national_id':
                return <Icon name="commercialRegister" />
            default:
                return <Icon name="taxCard" />
        }
    }

    const resolveTitle = (doc: Document) => {
        if (documentTitleKey) {
            return t(documentTitleKey(doc.type))
        }
        return doc.title
    }

    return (
        <div className="p-6">
            {title && (
                <SectionHeader title={title} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                    <div className="p-0 overflow-hidden border border-gray-100 rounded-xl">
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {getIcon(doc.type)}
                                <h4 className="text-base font-bold tracking-wider">
                                    {resolveTitle(doc)}
                                </h4>
                            </div>
                            <Button
                                variant="plain"
                                size="sm"
                                icon={<HiOutlineDownload size={20} />}
                                onClick={() => window.open(doc.fileUrl, '_blank')}
                                className="text-neutral-400"
                            />
                        </div>
                        <div className="px-6 pb-6">
                            <div className="aspect-[16/9] w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={doc.image}
                                    alt={doc.title}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DocumentsSection
