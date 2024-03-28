import type StorageItem from "~/types/api/StorageItem";
import type File from "~/types/api/File";
import type Folder from "~/types/api/Folder";

export const isFile = (item: StorageItem): item is File => "ext" in item;

export const isFolder = (item: StorageItem): item is Folder => "is_root" in item;

export const asHtmlElement = (target: EventTarget): target is HTMLElement => true
